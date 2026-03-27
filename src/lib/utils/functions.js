import { DASHBOARD, SIGNIN } from '$lib/utils/constants';
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import { resolve } from '$app/paths';
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

export const usdFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0
});

export const logout = async () => {
	pb.authStore.clear();
	document.documentElement.classList.remove('dark');
	await goto(resolve(SIGNIN));
	await toast.success('Successfully logged out!');
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

export const onlyNumbers = (e) => (e.target.value = e.target.value.replace(/\D/g, ''));

export const unformatCurrency = (e) => (e.target.value = e.target.value.replace(/\D/g, ''));

export const formatCurrency = (e) => {
	const value = e.target.value.replace(/\D/g, '');
	if (!value) return;
	e.target.value = usdFormatter.format(Number(value));
};

export const cleanNumber = (v) => {
	const cleaned = String(v).replace(/\D/g, '');
	return cleaned ? Number(cleaned) : null;
};
