export const ssr = false;

import { SIGNIN } from '$lib/utils/constants';
import { authCheck } from '$lib/utils/misc';
import { toast } from 'svelte-sonner';
import pb from '$lib/pocketbase.js';

export const load = async () => {
	authCheck(303, SIGNIN, true);

	try {
		const incomeRecords = await pb.collection('income').getFullList({
			filter: `user_id="${pb?.authStore?.record?.id}"`
		});
		const expenseRecords = await pb.collection('expenses').getFullList({
			filter: `user_id="${pb?.authStore?.record?.id}"`,
			expand: 'current_history'
		});
		return {
			incomeRecords: incomeRecords || [],
			expenseRecords: expenseRecords || []
		};
	} catch (error) {
		console.dir(error?.response, { depth: null });
		toast.error(error?.message ?? 'Could not connect to the server');
	}
};
