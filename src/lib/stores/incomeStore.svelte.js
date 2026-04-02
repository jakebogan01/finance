import { getUserIncomes } from '$lib/utils/functions.js';
import { toast } from 'svelte-sonner';
import pb from '$lib/pocketbase';

/**
 * ----------------------------------------
 * State
 * ----------------------------------------
 */
let paginated = $state(null);
let searchInput = $state('');
let all = $state([]);
let filters = $state({
	status: 'all',
	sort: 'latest',
	search: ''
});

let fetchTimeout;
let searchTimeout;

/**
 * ----------------------------------------
 * Derived
 * ----------------------------------------
 */
const total = $derived.by(() =>
	all.filter((r) => r.status).reduce((sum, r) => sum + (r.amount || 0), 0)
);

/**
 * ----------------------------------------
 * Helpers
 * ----------------------------------------
 */
const getSortValue = () => {
	if (filters.sort === 'latest') return '-created';
	if (filters.sort === 'income') return '-amount';
	return '-created';
};

let currentRequest = 0;

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
		if (error?.isAbort || error?.name === 'AbortError') return;
		console.dir(error?.response, { depth: null });
		toast.error(error?.message ?? 'Could not connect to the server');
	}
};

const scheduleFetchPage = () => {
	clearTimeout(fetchTimeout);
	fetchTimeout = setTimeout(fetchPage, 120);
};

const setPage = async (page) => fetchPage(page);

const setFilters = async (newFilters) => {
	filters = { ...filters, ...newFilters };

	// Reset to page 1 when filters change
	await fetchPage(1);
};

const setSearch = (value) => {
	searchInput = value;
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
 * Realtime Sync
 * ----------------------------------------
 */
const handleRealtime = async (e) => {
	const record = e.record;

	if (record.user !== pb.authStore.record?.id) return;

	switch (e.action) {
		case 'create':
			all = [...all, record];
			scheduleFetchPage();
			break;

		case 'delete':
			all = all.filter((r) => r.id !== record.id);
			scheduleFetchPage();
			break;

		case 'update':
			all = all.map((r) => (r.id === record.id ? record : r));

			if (paginated?.items) {
				paginated.items = paginated.items.map((item) => (item.id === record.id ? record : item));
			}
			break;
	}
};

/**
 * ----------------------------------------
 * Public API
 * ----------------------------------------
 */
const init = async () => {
	// Initial fetch
	paginated = await getUserIncomes();

	all = await pb.collection('incomes').getFullList({
		filter: `user="${pb.authStore.record?.id}"`,
		$autoCancel: false
	});

	// Subscribe
	await pb.collection('incomes').subscribe('*', handleRealtime);
};

const cleanup = async () => {
	clearTimeout(fetchTimeout);
	await pb.collection('incomes').unsubscribe('*');
};

export const incomeStore = {
	get paginated() {
		return paginated;
	},
	get total() {
		return total;
	},
	get filters() {
		return filters;
	},
	init,
	cleanup,
	setPage,
	setFilters,
	setSearch
};
