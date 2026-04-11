import pb from '$lib/pocketbase';
import { resetAccessibleUserIdsCache } from '$lib/utils/functions.js';
import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
import { accountHistoryStore } from '$lib/stores/accountHistoryStore.svelte.js';
import { budgetStore } from '$lib/stores/budgetStore.svelte.js';

let unsubscribed = false;

const handleSharedInviteRealtime = async (e) => {
	const record = e.record;
	const userId = pb.authStore.record?.id;

	if (!userId) return;

	const isRelevant = record.from_user === userId || record.to_user === userId;

	if (!isRelevant) return;

	if (record.status !== 'accepted') return;

	resetAccessibleUserIdsCache();

	await incomeStore.cleanup();
	await expenseStore.cleanup();
	await accountHistoryStore.cleanup();
	await budgetStore.cleanup();

	await incomeStore.init();
	await expenseStore.init();
	await accountHistoryStore.init();
	await budgetStore.init();
};

export const initSharedAccessRealtime = async () => {
	await pb.collection('shared_invites').subscribe('*', handleSharedInviteRealtime);
};

export const cleanupSharedAccessRealtime = async () => {
	if (unsubscribed) return;
	unsubscribed = true;

	await pb.collection('shared_invites').unsubscribe('*');
	unsubscribed = false;
};
