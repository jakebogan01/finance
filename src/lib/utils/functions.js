import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
import { DASHBOARD, SIGNIN } from '$lib/utils/constants';
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import { resolve } from '$app/paths';
import pb from '$lib/pocketbase.js';

/**
 * ----------------------------------------
 * Auth Helpers
 * ----------------------------------------
 */
const isAuthenticated = () =>
	pb.authStore.isValid && !!pb.authStore.token && !!pb.authStore?.record?.id;

export const authCheck = (status = 303, redirectLink = DASHBOARD, requireAuth = false) => {
	const authed = isAuthenticated();

	if (requireAuth && !authed) redirect(status, redirectLink);
	if (!requireAuth && authed) redirect(status, redirectLink);
};

/**
 * ----------------------------------------
 * Formatters
 * ----------------------------------------
 */
export const usdFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

export const calendarDateToISO = (value) => {
	if (!value) return null;
	const { year, month, day } = value;
	if (!year || !month || !day) return null;
	return new Date(year, month - 1, day).toISOString();
};

export const timeAgo = (dateInput) => {
	try {
		const date = new Date(dateInput);
		if (isNaN(date.getTime())) return '';
		const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

		const intervals = [
			['year', 31536000],
			['month', 2592000],
			['week', 604800],
			['day', 86400],
			['hour', 3600],
			['minute', 60],
			['second', 1]
		];

		for (const [unit, value] of intervals) {
			const count = Math.floor(seconds / value);
			if (count >= 1) return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
		}

		return 'just now';
	} catch (e) {
		console.error('Invalid date passed to timeAgo:', dateInput, e);
		return '';
	}
};

export const formatDate = (dateInput) => {
	if (!dateInput) return '';
	const date = new Date(dateInput);
	if (isNaN(date.getTime())) return '';
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(date);
};

/**
 * ----------------------------------------
 * Navigation / Auth Actions
 * ----------------------------------------
 */
export const logout = async () => {
	try {
		pb.authStore.clear();
		document.documentElement.classList.remove('dark');
		await goto(resolve(SIGNIN));
		toast.success('Successfully logged out!');
	} catch (err) {
		console.error('Logout failed:', err);
		toast.error('Failed to log out. Please try again.');
	}
};

/**
 * ----------------------------------------
 * Get Changed Fields (Diff)
 * ----------------------------------------
 */
export const getChangedFields = (oldObj = {}, newObj = {}) => {
	const changes = {};

	for (const key in newObj) {
		const oldVal = oldObj?.[key];
		const newVal = newObj?.[key];

		// Skip unchanged
		if (JSON.stringify(oldVal) === JSON.stringify(newVal)) continue;

		changes[key] = {
			old: oldVal ?? null,
			new: newVal ?? null
		};
	}

	return changes;
};

/**
 * ----------------------------------------
 * String Utilities
 * ----------------------------------------
 */
export const generateSlug = (value = '') =>
	String(value)
		.normalize('NFKD')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+|-+$/g, '');

export const getAvatarColor = (index = 0) =>
	activeColors.length ? activeColors[Math.abs(index) % activeColors.length] : '#ccc';

export const getInitials = (name = '') => {
	const userName = name || pb.authStore?.record?.name || pb.authStore?.record?.email || '';
	if (!userName) return '';
	return userName
		.trim()
		.split(/\s+/)
		.map((n) => n[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
};

/**
 * ----------------------------------------
 * User Total Updaters
 * ----------------------------------------
 */
let updatingTotal = false;
export const updateUserTotal = async (userId) => {
	if (updatingTotal) return;
	updatingTotal = true;

	try {
		const expenses = await pb.collection('expenses').getFullList({
			filter: `user="${userId}"`,
			fields: 'current_amount',
			$autoCancel: false
		});

		const total = expenses
			.filter((e) => e.status === true)
			.reduce((sum, e) => sum + (e.current_amount ?? 0), 0);

		await pb.collection('users').update(userId, { total_expenses: total, $autoCancel: false });
		return total;
	} catch (err) {
		if (!err?.isAbort) console.error('updateUserTotal failed:', err);
	} finally {
		updatingTotal = false;
	}
};

let updatingIncomeTotal = false;
export const updateUserIncomeTotal = async (userId) => {
	if (updatingIncomeTotal) return incomeStore.userTotal;
	updatingIncomeTotal = true;

	try {
		const incomes = await pb.collection('incomes').getFullList({
			filter: `user="${userId}"`,
			fields: 'amount',
			$autoCancel: false
		});

		const total = incomes
			.filter((i) => i.status === true)
			.reduce((sum, i) => sum + (i.amount ?? 0), 0);

		await pb.collection('users').update(userId, { total_income: total, $autoCancel: false });
		return total;
	} catch (err) {
		if (!err?.isAbort) console.error('updateUserIncomeTotal failed:', err);
	} finally {
		updatingIncomeTotal = false;
	}
};

/**
 * ----------------------------------------
 * Input Helpers
 * ----------------------------------------
 */
const stripNonDigits = (value) => String(value).replace(/\D/g, '');
export const onlyNumbers = (e) => {
	if (!e?.target) return;
	e.target.value = stripNonDigits(e.target.value);
};
export const unformatCurrency = (e) => {
	if (!e?.target) return;
	e.target.value = stripNonDigits(e.target.value);
};
export const formatCurrency = (e) => {
	if (!e?.target) return;
	const raw = stripNonDigits(e.target.value);
	e.target.value = raw ? usdFormatter.format(Number(raw)) : '';
};
export const formatPhone = (value) => {
	if (!value) return '';
	const digits = String(value).replace(/\D/g, '');
	const normalized = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
	if (normalized.length !== 10) return value;
	return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
};
export const cleanNumber = (value) => {
	const cleaned = stripNonDigits(value);
	return cleaned ? Number(cleaned) : null;
};

/**
 * ----------------------------------------
 * Account History Logger
 * ----------------------------------------
 */
export const logAccountHistory = async ({ type, title, description = '', meta = {} }) => {
	try {
		const userId = pb.authStore.record?.id;
		if (!userId) return;

		await pb.collection('account_history').create({
			user: userId,
			type,
			title,
			description,
			meta,
			$autoCancel: false
		});
	} catch (error) {
		if (!error?.isAbort) {
			console.error('Failed to log account history:', error);
		}
	}
};

export const getAccountHistory = async (limit = 20) => {
	try {
		return await pb.collection('account_history').getList(1, limit, {
			filter: `user="${pb.authStore.record?.id}"`,
			sort: '-created',
			$autoCancel: false
		});
	} catch (error) {
		console.error(error);
		return { items: [] };
	}
};

/**
 * ----------------------------------------
 * Object Utilities
 * ----------------------------------------
 */
export const cleanObject = (obj = {}) =>
	Object.fromEntries(
		Object.entries(obj).filter(
			([_, value]) => value !== '' && value !== null && value !== undefined
		)
	);

export const isEmpty = (value) => {
	if (!value || typeof value !== 'object') return false;
	if (Array.isArray(value)) return value.length === 0;
	return Object.keys(value).length === 0;
};

/**
 * ----------------------------------------
 * Data Utilities
 * ----------------------------------------
 */
export const deleteRecord = async (type, id) => {
	try {
		const collection = type.toLowerCase();

		let record = null;
		try {
			record = await pb.collection(collection).getOne(id, {
				$autoCancel: false
			});
		} catch (err) {
			// If fetch fails, continue anyway (don't block delete)
			console.warn('Could not fetch record before delete:', err);
		}

		await pb.collection(collection).delete(id);

		await logAccountHistory({
			type: `${collection.slice(0, -1)}_delete`,
			title: `Deleted ${collection.slice(0, -1)} "${record?.name || record?.title || ''}"`,
			meta: {
				deleted: record
			}
		});

		toast.success(`${type} successfully deleted!`);

		if (collection === 'incomes') {
			INCOMESLUG.value = null;
			history.replaceState(null, '', window.location.pathname + window.location.search);
		}

		if (collection === 'expenses') {
			EXPENSESLUG.value = null;
			history.replaceState(null, '', window.location.pathname + window.location.search);
		}
	} catch (error) {
		console.dir(error?.response, { depth: null });
		toast.error(`Failed to delete ${type}.`);
	}
};

/**
 * ----------------------------------------
 * PocketBase Utilities
 * ----------------------------------------
 */
export const getUserIncomes = async ({
	page = 1,
	perPage = 4,
	sort = '-created',
	status = 'all',
	search = ''
} = {}) => {
	let filter = `user="${pb.authStore.record?.id}"`;
	if (status === 'active') filter += ' && status=true';
	if (status === 'inactive') filter += ' && status=false';
	if (search?.trim()) filter += ` && name ~ "${search.replace(/"/g, '\\"')}"`;

	return await pb
		.collection('incomes')
		.getList(page, perPage, { filter, sort, $autoCancel: false });
};

export const getUserExpenses = async ({
	page = 1,
	perPage = 4,
	sort = '-created',
	status = 'all',
	search = ''
} = {}) => {
	let filter = `user="${pb.authStore.record?.id}"`;
	if (status === 'active') filter += ' && status=true';
	if (status === 'inactive') filter += ' && status=false';
	if (search?.trim()) filter += ` && title ~ "${search.replace(/"/g, '\\"')}"`;

	return await pb
		.collection('expenses')
		.getList(page, perPage, { filter, sort, expand: 'current_history', $autoCancel: false });
};

/**
 * ----------------------------------------
 * Constants
 * ----------------------------------------
 */
export const payTypes = [
	{ value: 'per month', label: 'Per Month' },
	{ value: 'bi weekly', label: 'Bi Weekly' },
	{ value: 'per week', label: 'Per Week' }
];
export const categoryTypes = [
	{ value: 'Bill', label: 'Bill' },
	{ value: 'Subscription', label: 'Subscription' }
];
export const activeColors = [
	'bg-yellow-100 dark:bg-amber-100',
	'bg-blue-100 dark:bg-blue-200',
	'bg-green-100 dark:bg-green-200',
	'bg-red-100 dark:bg-red-200'
];
export const states = [
	'Alabama',
	'Alaska',
	'Arizona',
	'Arkansas',
	'California',
	'Colorado',
	'Connecticut',
	'Delaware',
	'Florida',
	'Georgia',
	'Hawaii',
	'Idaho',
	'Illinois',
	'Indiana',
	'Iowa',
	'Kansas',
	'Kentucky',
	'Louisiana',
	'Maine',
	'Maryland',
	'Massachusetts',
	'Michigan',
	'Minnesota',
	'Mississippi',
	'Missouri',
	'Montana',
	'Nebraska',
	'Nevada',
	'New Hampshire',
	'New Jersey',
	'New Mexico',
	'New York',
	'North Carolina',
	'North Dakota',
	'Ohio',
	'Oklahoma',
	'Oregon',
	'Pennsylvania',
	'Rhode Island',
	'South Carolina',
	'South Dakota',
	'Tennessee',
	'Texas',
	'Utah',
	'Vermont',
	'Virginia',
	'Washington',
	'West Virginia',
	'Wisconsin',
	'Wyoming'
].map((s) => ({ value: s.replace(/\s+/g, ' '), label: s }));

export const fillMissingMonths = (history) => {
	if (!history || history.length === 0) return [];
	const sorted = [...history].sort((a, b) => a.year - b.year || a.month - b.month);
	const filled = [];
	let lastAmount = null;
	for (let i = 0; i < sorted.length; i++) {
		const record = sorted[i];
		if (i === 0) {
			// BACKFILL from January → first record
			for (let m = 1; m < record.month; m++) {
				filled.push({
					month: m,
					year: record.year,
					amount: record.amount
				});
			}

			filled.push(record);
			lastAmount = record.amount;
			continue;
		}
		const prev = sorted[i - 1];
		let year = prev.year;
		let month = prev.month + 1;
		while (year < record.year || month < record.month) {
			filled.push({ month, year, amount: lastAmount });
			month++;
			if (month > 12) {
				month = 1;
				year++;
			}
		}
		filled.push(record);
		lastAmount = record.amount;
	}
	const latestRecord = filled[filled.length - 1];
	let month = latestRecord.month + 1;
	let year = latestRecord.year;
	lastAmount = latestRecord.amount;
	const now = new Date();
	while (year < now.getFullYear() || month <= now.getMonth() + 1) {
		filled.push({ month, year, amount: lastAmount });
		month++;
		if (month > 12) {
			month = 1;
			year++;
		}
		if (year > now.getFullYear()) break;
	}
	return filled;
};

export const getExpenseHistoryMap = async (userId) => {
	try {
		const history = await pb.collection('expense_history').getFullList({
			filter: `expense.user="${userId}"`,
			sort: 'year,month',
			expand: 'expense',
			$autoCancel: false
		});

		const map = {};

		for (const item of history) {
			const expenseId = item.expense;

			if (!expenseId) continue;

			if (!map[expenseId]) {
				map[expenseId] = [];
			}

			map[expenseId].push({
				month: item.month,
				year: item.year,
				amount: item.amount
			});
		}

		return map;
	} catch (error) {
		console.dir(error?.response, { depth: null });
		toast.error('Failed to fetch expense history:');
		return {};
	}
};

/**
 * ----------------------------------------
 * Budget Utilities
 * ----------------------------------------
 */
export const getUserBudget = async () => {
	try {
		return await pb
			.collection('budgets')
			.getFirstListItem(`user="${pb.authStore.record?.id}"`, { $autoCancel: false });
	} catch (error) {
		// No budget yet
		if (error?.status === 404) return null;
		console.dir(error?.response, { depth: null });
		toast.error('Failed to connect to server');
		return null;
	}
};

export const saveUserBudget = async (amount) => {
	try {
		const userId = pb.authStore.record?.id;

		// check if exists
		const existing = await getUserBudget();

		if (existing) {
			const oldAmount = existing.amount;
			const updated = await pb.collection('budgets').update(existing.id, {
				amount,
				$autoCancel: false
			});

			if (oldAmount !== amount) {
				await logAccountHistory({
					type: 'budget_update',
					title: `Updated budget: ${usdFormatter.format(oldAmount)} to ${usdFormatter.format(amount)}`,
					meta: {
						amount: {
							old: oldAmount,
							new: amount
						}
					}
				});
			}

			return updated;
		}

		// create if not exists
		const created = await pb.collection('budgets').create({
			user: userId,
			amount,
			$autoCancel: false
		});

		await logAccountHistory({
			type: 'budget_update',
			title: `Set budget to ${usdFormatter.format(amount)}`,
			meta: { amount }
		});

		return created;
	} catch (error) {
		console.dir(error?.response, { depth: null });
		toast.error('Failed to connect to server');
		throw error;
	}
};
