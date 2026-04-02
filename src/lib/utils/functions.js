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
 * Formats a date into "time ago" (e.g., 2 days ago)
 * @param {string|Date} dateInput
 * @returns {string}
 */
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
			if (count >= 1) {
				return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
			}
		}

		return 'just now';
	} catch (e) {
		console.error('Invalid date passed to timeAgo:', dateInput, e);
		return '';
	}
};

/**
 * Formats a date string into readable format (e.g., Jan 1, 2025)
 * @param {string|Date} dateInput
 * @returns {string}
 */
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
 * Formats a phone number into (XXX) XXX-XXXX
 * @param {string} value
 * @returns {string}
 */
export const formatPhone = (value) => {
	if (!value) return '';

	const digits = String(value).replace(/\D/g, '');

	// Handle leading "1" (US country code)
	const normalized = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;

	if (normalized.length !== 10) return value;

	const area = normalized.slice(0, 3);
	const prefix = normalized.slice(3, 6);
	const line = normalized.slice(6);

	return `(${area}) ${prefix}-${line}`;
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
 * Checks if a value is an empty object
 * @param {any} value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
	if (!value || typeof value !== 'object') return false;

	// Exclude arrays
	if (Array.isArray(value)) return value.length === 0;

	return Object.keys(value).length === 0;
};

/**
 * ----------------------------------------
 * Data Utilities
 * ----------------------------------------
 */

/**
 * ----------------------------------------
 * PocketBase Utilities
 * ----------------------------------------
 */
/**
 * Fetch paginated incomes for the authenticated user
 * @param {Object} options
 * @param {number} options.page
 * @param {number} options.perPage
 * @param {string} options.sort
 * @returns {Promise<Object|null>}
 */
export const getUserIncomes = async ({
	page = 1,
	perPage = 4,
	sort = '-created',
	status = 'all',
	search = ''
} = {}) => {
	let filter = `user="${pb.authStore.record?.id}"`;

	if (status === 'active') {
		filter += ' && status=true';
	}

	if (status === 'inactive') {
		filter += ' && status=false';
	}

	if (search && search.trim().length > 0) {
		const safe = search.replace(/"/g, '\\"');
		filter += ` && name ~ "${safe}"`;
	}

	return await pb.collection('incomes').getList(page, perPage, {
		filter,
		sort,
		$autoCancel: false
	});
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
