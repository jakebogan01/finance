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
