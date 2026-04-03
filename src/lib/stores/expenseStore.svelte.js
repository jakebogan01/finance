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
let totalTimeout;

/**
 * ----------------------------------------
 * Derived
 * ----------------------------------------
 */
const total = $derived.by(() => {
	if (!paginated?.items?.length) return 0;
	return paginated.items.reduce((sum, e) => sum + (e.current_amount ?? 0), 0);
});

/**
 * ----------------------------------------
 * Helpers
 * ----------------------------------------
 */
const scheduleUserTotalUpdate = (userId) => {
	clearTimeout(totalTimeout);

	totalTimeout = setTimeout(() => {
		updateUserTotal(userId);
	}, 150);
};

const getSortValue = () => {
	if (filters.sort === 'latest') return '-created';
	if (filters.sort === 'amount') return '-current_amount';
	return '-created';
};

const fetchUserTotal = async () => {
	if (!pb.authStore.isValid) return;

	const userId = pb.authStore.record?.id;
	const user = await pb.collection('users').getOne(userId, {
		fields: 'total_expenses'
	});

	userTotal = user.total_expenses ?? 0;
};

const getAmount = (item) => {
	const full = allExpenses.find((e) => e.id === item.id);
	return full?.current_amount ?? full?.expand?.current_history?.amount ?? 0;
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
			scheduleUserTotalUpdate(record.user);
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
	paginated = await getUserExpenses();

	allExpenses = await pb.collection('expenses').getFullList({
		filter: `user="${pb.authStore.record?.id}"`,
		expand: 'current_history',
		$autoCancel: false
	});

	// Realtime subscriptions
	await fetchUserTotal();

	await pb.collection('expenses').subscribe('*', handleExpenseRealtime);

	await pb.collection('expense_history').subscribe('*', async (e) => {
		const record = e.record;
		if (!record.expense) return;

		// Use try/catch to prevent unhandled aborts
		try {
			// Only update if current_amount changed
			await pb
				.collection('expenses')
				.update(record.expense, { current_amount: record.amount, $autoCancel: false });
			scheduleUserTotalUpdate(pb.authStore.record?.id);
			scheduleFetchPage();
		} catch (err) {
			if (err?.isAbort) return; // ignore aborts
			console.error('Realtime expense update failed', err);
		}
	});
};

const cleanup = async () => {
	clearTimeout(fetchTimeout);
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
