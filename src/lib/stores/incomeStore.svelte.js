import { getUserIncomes, getAccessibleUserIds } from '$lib/utils/functions.js';
import { toast } from 'svelte-sonner';
import pb from '$lib/pocketbase';

/**
 * State
 */
let paginated = $state(null);
let userTotal = $state(0);
let accessibleUserIds = $state([]);

let filters = $state({
	status: 'all',
	sort: 'latest',
	search: ''
});

let initialized = false;
let unsubscribed = false;

let fetchTimeout;
let searchTimeout;
let currentRequest = 0;
let fetchUserTotalTimeout;

/**
 * Helpers
 */
const setSearch = (value) => {
	clearTimeout(searchTimeout);

	searchTimeout = setTimeout(() => {
		const trimmed = value.trim();
		if (trimmed.length > 0 && trimmed.length < 2) return;
		if (filters.search === trimmed) return;

		filters = { ...filters, search: trimmed };
		fetchPage(1);
	}, 500);
};

const setPage = (page) => fetchPage(page);

const setFilters = async (newFilters) => {
	filters = { ...filters, ...newFilters };
	await fetchPage(1);
};

const getSortValue = () => {
	if (filters.sort === 'latest') return '-created';
	if (filters.sort === 'income') return '-amount';
	return '-created';
};

const fetchUserTotal = async () => {
	if (!pb.authStore.isValid) return;

	const filter = accessibleUserIds.map((id) => `user="${id}"`).join(' || ');

	const records = await pb.collection('incomes').getFullList({
		filter: `(${filter}) && status=true`,
		fields: 'amount',
		$autoCancel: false
	});

	userTotal = records.reduce((sum, i) => sum + (i.amount ?? 0), 0);
};

const scheduleFetchUserTotal = () => {
	clearTimeout(fetchUserTotalTimeout);
	fetchUserTotalTimeout = setTimeout(fetchUserTotal, 100);
};

const fetchPage = async (pageOverride) => {
	const requestId = ++currentRequest;

	try {
		const page = pageOverride ?? paginated?.page ?? 1;

		const result = await getUserIncomes({
			page,
			sort: getSortValue(),
			status: filters.status,
			search: filters.search
		});

		if (requestId !== currentRequest) return;

		paginated = result;
	} catch (error) {
		if (!error?.isAbort) {
			console.dir(error?.response, { depth: null });
			toast.error(error?.message ?? 'Server error');
		}
	}
};

const setUserTotal = (value) => {
	userTotal = value ?? 0;
};

const handleRealtime = async (e) => {
	const record = e.record;

	if (!accessibleUserIds.includes(record.user)) return;

	// ALWAYS refetch instead of mutating local state
	await fetchPage(paginated?.page ?? 1);
	scheduleFetchUserTotal();
};

/**
 * Init / Cleanup
 */
const init = async () => {
	if (initialized) return;
	initialized = true;

	accessibleUserIds = await getAccessibleUserIds();

	paginated = await getUserIncomes();
	await fetchUserTotal();

	await pb.collection('incomes').subscribe('*', handleRealtime);
};

const cleanup = async () => {
	if (unsubscribed) return;
	unsubscribed = true;

	clearTimeout(fetchTimeout);
	clearTimeout(fetchUserTotalTimeout);

	await pb.collection('incomes').unsubscribe('*');

	initialized = false;
	unsubscribed = false;
};

export const incomeStore = {
	get userTotal() {
		return userTotal;
	},
	get paginated() {
		return paginated;
	},
	get filters() {
		return filters;
	},
	init,
	cleanup,
	setPage,
	setFilters,
	setSearch,
	setUserTotal
};
