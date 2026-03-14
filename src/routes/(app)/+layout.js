export const ssr = false;

import { SIGNIN } from '$lib/utils/constants';
import { authCheck } from '$lib/utils/misc';
import { toast } from 'svelte-sonner';
import pb from '$lib/pocketbase.js';

export const load = async () => {
	authCheck(303, SIGNIN, true);

	try {
		const userId = pb.authStore.record.id;
		const incomeRecords = await pb.collection('income').getFullList({
			filter: `user_id="${userId}"`
		});
		const expenseRecords = await pb.collection('expenses').getFullList({
			filter: `user_id="${userId}"`,
			expand: 'current_history'
		});
		const expenseHistory = await pb.collection('expense_history').getFullList({
			filter: `created_by="${userId}"`,
			sort: 'year,month'
		});

		const expenseHistoryMap = {};

		for (const record of expenseHistory) {
			if (!expenseHistoryMap[record.expense]) {
				expenseHistoryMap[record.expense] = [];
			}

			expenseHistoryMap[record.expense].push(record);
		}

		return {
			incomeRecords: incomeRecords ?? [],
			expenseRecords: expenseRecords ?? [],
			expenseHistory: expenseHistory ?? [],
			expenseHistoryMap
		};
	} catch (error) {
		console.dir(error?.response, { depth: null });
		toast.error(error?.message ?? 'Could not connect to the server');
	}
};
