// expenseStore.svelte.js
import { getUserExpenses, updateUserTotal } from '$lib/utils/functions.js';
import { toast } from 'svelte-sonner';
import pb from '$lib/pocketbase';

/**
 * ----------------------------------------
 * State
 * ----------------------------------------
 */
let paginated = $state(null);
let userTotal = $state(0);
let allExpenses = $state([]);
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
	if (filters.sort === 'amount') return '-current_amount';
	return '-created';
};

const fetchUserTotal = async () => {
	if (!pb.authStore.isValid) return;

	userTotal = paginated?.items
		.filter((i) => i.status === true)
		.reduce((sum, i) => sum + (i.current_amount ?? 0), 0);
};

const scheduleFetchUserTotal = () => {
	clearTimeout(fetchUserTotalTimeout);
	fetchUserTotalTimeout = setTimeout(fetchUserTotal, 100);
};

const fetchPage = async (pageOverride) => {
	const requestId = ++currentRequest;

	try {
		const page = pageOverride ?? paginated?.page ?? 1;

		const result = await getUserExpenses({
			page,
			sort: getSortValue(),
			status: filters.status,
			search: filters.search
		});

		if (requestId !== currentRequest) return;

		paginated = result;
		scheduleFetchUserTotal(); // always update total after fetching page
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
 * Realtime: EXPENSES
 * ----------------------------------------
 */
const handleExpenseRealtime = async (e) => {
	const record = e.record;
	if (record.user !== pb.authStore.record?.id) return;

	switch (e.action) {
		case 'create':
		case 'update':
		case 'delete':
			scheduleFetchPage(); // updates paginated and totals
			break;
	}
};

/**
 * ----------------------------------------
 * Init / Cleanup
 * ----------------------------------------
 */
const init = async () => {
	paginated = await getUserExpenses();
	allExpenses = await pb.collection('expenses').getFullList({
		filter: `user="${pb.authStore.record?.id}"`,
		expand: 'current_history',
		$autoCancel: false
	});

	await fetchUserTotal(); // initial total
	await pb.collection('expenses').subscribe('*', handleExpenseRealtime);
};

const cleanup = async () => {
	clearTimeout(fetchTimeout);
	clearTimeout(fetchUserTotalTimeout);
	await pb.collection('expenses').unsubscribe('*');
	await pb.collection('expense_history').unsubscribe('*');
};

export const expenseStore = {
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
			.reduce((sum, e) => sum + (e.current_amount ?? 0), 0);
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
