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
].map((s) => ({ value: s.toLowerCase().replace(/\s+/g, '-'), label: s }));

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
].map((s) => ({ value: s.toLowerCase().replace(/\s+/g, '-'), label: s }));
