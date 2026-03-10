import { DASHBOARD } from '$lib/utils/constants';
import { redirect } from '@sveltejs/kit';
import pb from '$lib/pocketbase.js';

export const authCheck = (status = 303, redirectLink = DASHBOARD, authenticated = false) => {
	if (authenticated) {
		if (!pb.authStore.isValid && !pb.authStore.token && !pb.authStore?.record?.id)
			redirect(status, redirectLink);
	} else {
		if (pb.authStore.isValid && pb.authStore.token && pb.authStore?.record?.id)
			redirect(status, redirectLink);
	}
};

export const generateSlug = (title) => {
	return title
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/[^\w\-]+/g, '') // Remove non-word characters
		.replace(/\-\-+/g, '-') // Replace multiple hyphens with a single hyphen
		.replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
};

export const onlyNumbers = (e) => {
	e.target.value = e.target.value.replace(/\D/g, '');
};

export const unformatCurrency = (e) => {
	e.target.value = e.target.value.replace(/\D/g, '');
};

export const formatCurrency = (e) => {
	const value = e.target.value.replace(/\D/g, '');
	if (!value) return;
	e.target.value = usdFormatter.format(Number(value));
};

export const usdFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

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
].map((s) => ({ value: s.replace(/\s+/g, '-'), label: s }));

export const payTypes = [
	'Per Day',
	'Per Week',
	'Bi Weekly',
	'Per Month',
	'Semi Monthly',
	'Bi Monthly',
	'Quarterly',
	'Semi annually',
	'Annually',
	'On Commission',
	'On Demand',
	'Irregularly'
].map((s) => ({ value: s.toLowerCase().replace(/\s+/g, ' '), label: s }));

export const categories = ['Bill', 'Subscription'].map((s) => ({
	value: s.toLowerCase().replace(/\s+/g, '-'),
	label: s
}));

export const formatDate = (dateStr) => {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	const options = {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	};
	return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const timeAgo = (dateString) => {
	try {
		const date = new Date(dateString);
		const now = new Date();
		const seconds = Math.floor((now - date) / 1000);
		const intervals = {
			year: 31536000,
			month: 2592000,
			week: 604800,
			day: 86400,
			hour: 3600,
			minute: 60,
			second: 1
		};
		for (const [unit, value] of Object.entries(intervals)) {
			const count = Math.floor(seconds / value);
			if (count >= 1) {
				return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
			}
		}
		return 'just now';
	} catch (e) {
		console.error('Invalid date string passed to timeAgo:', dateString, e);
		return '';
	}
};

export const formatPhone = (value) => {
	if (!value) return '';
	const digits = value.replace(/\D/g, '');
	const normalized = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
	if (normalized.length !== 10) return value;
	const area = normalized.slice(0, 3);
	const prefix = normalized.slice(3, 6);
	const line = normalized.slice(6);
	return `(${area}) ${prefix}-${line}`;
};

export const cleanObject = (obj) => {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([_, value]) => value !== '' && value !== null && value !== undefined
		)
	);
};

export const calendarDateToISO = (value) => {
	if (!value) return null;

	return new Date(value.year, value.month - 1, value.day).toISOString();
};

export const isEmpty = (obj) => obj && typeof obj === 'object' && Object.keys(obj).length === 0;

export const filterStatus = (list, status) => {
	if (status === 'active') return list.filter((i) => i.status === true);
	if (status === 'inactive') return list.filter((i) => i.status === false);
	return list;
};

export const sortRecords = (list, sort) => {
	if (sort === 'latest') {
		return list.toSorted((a, b) => Date.parse(b.updated) - Date.parse(a.updated));
	}

	if (sort === 'income') {
		return list.toSorted((a, b) => {
			const incomeA = Number(a.income) || 0;
			const incomeB = Number(b.income) || 0;
			return incomeB - incomeA;
		});
	}

	return list;
};
