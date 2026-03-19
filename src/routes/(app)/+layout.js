export const ssr = false;

import { SIGNIN } from '$lib/utils/constants';
import { authCheck } from '$lib/utils/misc';
import { toast } from 'svelte-sonner';
import pb from '$lib/pocketbase.js';

export const load = async () => {
	authCheck(303, SIGNIN, true);

	try {
		const userId = pb.authStore.record.id;
		const sharedConnections = await pb.collection('shared_invites').getFullList({
			filter: `status="accepted" && (from_user="${userId}" || to_user="${userId}")`
		});
		const sharedUserIds = sharedConnections.map((invite) => {
			return invite.from_user === userId ? invite.to_user : invite.from_user;
		});
		const allUserIds = [userId, ...sharedUserIds];
		const incomeRecords = await pb.collection('income').getFullList({
			filter: allUserIds.map((id) => `(user_id="${id}" || original_user_id="${id}")`).join(' || ')
		});
		const expenseRecords = await pb.collection('expenses').getFullList({
			filter: allUserIds.map((id) => `(user_id="${id}" || original_user_id="${id}")`).join(' || '),
			expand: 'current_history'
		});
		const expenseHistory = await pb.collection('expense_history').getFullList({
			filter: allUserIds
				.map((id) => `(created_by="${id}" || original_user_id="${id}")`)
				.join(' || '),
			sort: 'year,month'
		});
		const currentBudget = await pb.collection('budgets').getFullList({
			filter: allUserIds.map((id) => `(user_id="${id}" || original_user_id="${id}")`).join(' || '),
			fields: 'amount, id'
		});
		const accountHistory = await pb.collection('account_history').getFullList({
			filter: allUserIds.map((id) => `(user_id="${id}" || original_user_id="${id}")`).join(' || '),
			sort: '-created'
		});
		const sharedInvites = await pb.collection('shared_invites').getFullList({
			filter: `from_user="${userId}" || to_user="${userId}"`,
			expand: 'from_user,to_user'
		});

		const expenseHistoryMap = {};

		for (const record of expenseHistory) {
			if (!expenseHistoryMap[record.expense]) {
				expenseHistoryMap[record.expense] = [];
			}

			expenseHistoryMap[record.expense].push(record);
		}

		const activeIncome = incomeRecords.filter((r) => r.status);
		const activeExpenses = expenseRecords.filter((r) => r.status);
		const totalMonthlyIncome = activeIncome.reduce((sum, r) => sum + r.income, 0);
		const totalMonthlyExpenses = activeExpenses.reduce((sum, r) => {
			return sum + (r.expand?.current_history?.amount ?? 0);
		}, 0);
		const remainingIncome = totalMonthlyIncome - totalMonthlyExpenses;

		return {
			incomeRecords: incomeRecords ?? [],
			expenseRecords: expenseRecords ?? [],
			expenseHistory: expenseHistory ?? [],
			expenseHistoryMap: expenseHistoryMap ?? {},
			totalMonthlyIncome: totalMonthlyIncome ?? 0,
			totalMonthlyExpenses: totalMonthlyExpenses ?? 0,
			remainingIncome: remainingIncome ?? 0,
			activeExpenses: activeExpenses ?? [],
			activeIncome: activeIncome ?? [],
			currentBudget: currentBudget ?? [],
			accountHistory: accountHistory ?? [],
			sharedInvites: sharedInvites ?? []
		};
	} catch (error) {
		console.dir(error?.response, { depth: null });
		toast.error(error?.message ?? 'Could not connect to the server');
	}
};
