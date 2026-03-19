export const ssr = false;

import { SIGNIN } from '$lib/utils/constants.js';
import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import { resolve } from '$app/paths';
import pb from '$lib/pocketbase.js';

export const load = async () => {
	pb.authStore.clear();
	toast.success('Successfully logged out!');
	await goto(resolve(SIGNIN));
};
