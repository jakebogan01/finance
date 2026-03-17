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
		const currentBudget = await pb.collection('budgets').getFullList({
			filter: `user_id="${userId}"`,
			fields: 'amount, id'
		});
		const accountHistory = await pb.collection('account_history').getFullList({
			filter: `user_id="${userId}"`,
			sort: '-created'
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
		// console.log('Income Records: ', incomeRecords);
		// console.log('Expense Records: ', expenseRecords);
		// console.log('Active Income:', activeIncome);
		// console.log('Active Expenses:', activeExpenses);
		// console.log('Expense History: ', expenseHistory);
		// console.log('Expense History Map: ', expenseHistoryMap);
		// console.log('Total Income: ', totalMonthlyIncome);
		// console.log('Total Expenses: ', totalMonthlyExpenses);
		// console.log('Remaining Income: ', remainingIncome);

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
			accountHistory: accountHistory ?? []
		};
	} catch (error) {
		console.dir(error?.response, { depth: null });
		toast.error(error?.message ?? 'Could not connect to the server');
	}
};
