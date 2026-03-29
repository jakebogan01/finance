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

/**
 * Handles route protection
 * @param {number} status
 * @param {string} redirectLink
 * @param {boolean} requireAuth - true = must be logged in, false = must be logged out
 */
export const authCheck = (status = 303, redirectLink = DASHBOARD, requireAuth = false) => {
	const authed = isAuthenticated();

	if (requireAuth && !authed) {
		redirect(status, redirectLink);
	}

	if (!requireAuth && authed) {
		redirect(status, redirectLink);
	}
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

/**
 * Converts calendar date object to ISO string
 * @param {{ year: number, month: number, day: number }} value
 * @returns {string|null}
 */
export const calendarDateToISO = (value) => {
	if (!value) return null;

	const { year, month, day } = value;
	if (!year || !month || !day) return null;

	return new Date(year, month - 1, day).toISOString();
};

/**
 * ----------------------------------------
 * Navigation / Auth Actions
 * ----------------------------------------
 */
export const logout = async () => {
	try {
		pb.authStore.clear();

		// reset theme (if applicable)
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
 * String Utilities
 * ----------------------------------------
 */
export const generateSlug = (value = '') => {
	return String(value)
		.normalize('NFKD') // handle accented characters
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+|-+$/g, '');
};

/**
 * ----------------------------------------
 * User Utilities
 * ----------------------------------------
 */

/**
 * Returns a color based on index (useful for avatars)
 * @param {number} index
 * @returns {string}
 */
export const getAvatarColor = (index = 0) => {
	if (!activeColors.length) return '#ccc';
	return activeColors[Math.abs(index) % activeColors.length];
};

/**
 * Generates user initials from a name
 * Falls back to authenticated user if no name provided
 * @param {string} name
 * @returns {string}
 */
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
	if (!raw) {
		e.target.value = '';
		return;
	}

	e.target.value = usdFormatter.format(Number(raw));
};

/**
 * Safely converts input to a number
 * @returns {number|null}
 */
export const cleanNumber = (value) => {
	const cleaned = stripNonDigits(value);
	return cleaned ? Number(cleaned) : null;
};

/**
 * ----------------------------------------
 * Object Utilities
 * ----------------------------------------
 */
/**
 * Removes empty values from an object
 * (filters out: '', null, undefined)
 * @param {Object} obj
 * @returns {Object}
 */
export const cleanObject = (obj = {}) => {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([_, value]) => value !== '' && value !== null && value !== undefined
		)
	);
};

/**
 * ----------------------------------------
 * Data Utilities
 * ----------------------------------------
 */
/**
 * Filters a list by status
 * @param {Array} list
 * @param {'active' | 'inactive' | 'all'} status
 * @returns {Array}
 */
export const filterStatus = (list = [], status = 'all') => {
	if (!Array.isArray(list)) return [];

	if (status === 'active') {
		return list.filter((item) => item?.status === true);
	}

	if (status === 'inactive') {
		return list.filter((item) => item?.status === false);
	}

	return list;
};

/**
 * Safely extracts numeric value
 * @param {any} value
 * @returns {number}
 */
const toNumber = (value) => {
	const num = Number(value);
	return Number.isFinite(num) ? num : 0;
};

/**
 * Sorts records by various strategies
 * @param {Array} list
 * @param {'latest' | 'income' | 'amount'} sort
 * @returns {Array}
 */
export const sortRecords = (list = [], sort = 'latest') => {
	if (!Array.isArray(list)) return [];

	// fallback for older environments (in case toSorted isn't supported)
	const safeSort = (arr, fn) =>
		typeof arr.toSorted === 'function' ? arr.toSorted(fn) : [...arr].sort(fn);

	if (sort === 'latest') {
		return safeSort(list, (a, b) => {
			const aDate = Date.parse(a?.updated || a?.created || 0);
			const bDate = Date.parse(b?.updated || b?.created || 0);
			return bDate - aDate;
		});
	}

	if (sort === 'income') {
		return safeSort(list, (a, b) => {
			const incomeA = toNumber(a?.income);
			const incomeB = toNumber(b?.income);
			return incomeB - incomeA;
		});
	}

	if (sort === 'amount') {
		return safeSort(list, (a, b) => {
			const amountA = toNumber(a?.expand?.current_history?.amount);
			const amountB = toNumber(b?.expand?.current_history?.amount);
			return amountB - amountA;
		});
	}

	return list;
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
export const activeColors = [
	'bg-yellow-100 dark:bg-amber-100',
	'bg-blue-100 dark:bg-blue-200',
	'bg-green-100 dark:bg-green-200',
	'bg-red-100 dark:bg-red-200'
];

export const states = [
	'None',
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
].map((s) => ({
	value: s.replace(/\s+/g, ' '),
	label: s
}));
