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
 * Constants
 * ----------------------------------------
 */
export const payTypes = [
	{ value: 'per month', label: 'Per Month' },
	{ value: 'bi weekly', label: 'Bi Weekly' },
	{ value: 'per week', label: 'Per Week' }
];
