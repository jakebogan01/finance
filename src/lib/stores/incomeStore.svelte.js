import { getUserIncomes } from '$lib/utils/functions.js';
import { toast } from 'svelte-sonner';
import pb from '$lib/pocketbase';

/**
 * ----------------------------------------
 * State
 * ----------------------------------------
 */
let paginated = $state(null);
let userTotal = $state(0);
let filters = $state({
	status: 'all',
	sort: 'latest',
	search: ''
});

let fetchTimeout;
let searchTimeout;
let currentRequest = 0;
let fetchUserTotalTimeout;

/**
 * ----------------------------------------
 * Helpers
 * ----------------------------------------
 */
const setUserTotal = (value) => {
	userTotal = value ?? 0;
};

const getSortValue = () => {
	if (filters.sort === 'latest') return '-created';
	if (filters.sort === 'income') return '-amount';
	return '-created';
};

const fetchUserTotal = async () => {
	if (!pb.authStore.isValid) return;

	const records = await pb.collection('incomes').getFullList({
		filter: `user="${pb.authStore.record?.id}" && status=true`,
		fields: 'amount',
		$autoCancel: false
	});

	if (!records.length && userTotal > 0) return;

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
		if (error?.isAbort) return;
		console.dir(error?.response, { depth: null });
		toast.error(error?.message ?? 'Server error');
	}
};

const scheduleFetchPage = () => {
	clearTimeout(fetchTimeout);
	fetchTimeout = setTimeout(fetchPage, 120);
};

const setPage = (page) => fetchPage(page);

const setFilters = async (newFilters) => {
	filters = { ...filters, ...newFilters };
	await fetchPage(1);
};

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

/**
 * ----------------------------------------
 * Realtime: INCOMES
 * ----------------------------------------
 */
const handleIncomeRealtime = async (e) => {
	const record = e.record;
	if (record.user !== pb.authStore.record?.id) return;

	switch (e.action) {
		case 'create':
			userTotal += record.amount ?? 0; // instant feedback
			scheduleFetchUserTotal(); // correct it after
			break;
		case 'update':
		case 'delete':
			scheduleFetchUserTotal();
			scheduleFetchPage();
			break;
	}
};

/**
 * ----------------------------------------
 * Init / Cleanup
 * ----------------------------------------
 */
const init = async () => {
	paginated = await getUserIncomes();
	await fetchUserTotal(); // initial total
	await pb.collection('incomes').subscribe('*', handleIncomeRealtime);
};

const cleanup = async () => {
	clearTimeout(fetchTimeout);
	clearTimeout(fetchUserTotalTimeout);
	await pb.collection('incomes').unsubscribe('*');
};

export const incomeStore = {
	get userTotal() {
		return userTotal;
	},
	get paginated() {
		return paginated;
	},
	get total() {
		if (!paginated?.items?.length) return 0;
		return paginated.items
			.filter((e) => e.status === true)
			.reduce((sum, e) => sum + (e.amount ?? 0), 0);
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
