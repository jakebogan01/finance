import { getUserBudget, saveUserBudget } from '$lib/utils/functions.js';
import { toast } from 'svelte-sonner';

let amount = $state(0);
let loading = $state(true);

let initialAmount = 0;
let debounceTimer;

/**
 * ----------------------------------------
 * Init
 * ----------------------------------------
 */
const init = async () => {
	loading = true;

	const data = await getUserBudget();

	amount = data?.amount ?? 0;
	initialAmount = amount;

	loading = false;
};

/**
 * ----------------------------------------
 * Update (Debounced)
 * ----------------------------------------
 */
const update = (value) => {
	amount = value;

	clearTimeout(debounceTimer);

	debounceTimer = setTimeout(async () => {
		// no change
		if (value === initialAmount) return;

		// avoid useless 0 → 0
		if (value === 0 && initialAmount === 0) return;

		await saveUserBudget(value);

		// update baseline
		initialAmount = value;
		toast.success('Budget updated successfully');
	}, 1000);
};

/**
 * ----------------------------------------
 * Cleanup
 * ----------------------------------------
 */
const cleanup = () => {
	clearTimeout(debounceTimer);
};

/**
 * ----------------------------------------
 * Store Export
 * ----------------------------------------
 */
export const budgetStore = {
	get amount() {
		return amount;
	},
	get loading() {
		return loading;
	},
	init,
	update,
	cleanup
};
