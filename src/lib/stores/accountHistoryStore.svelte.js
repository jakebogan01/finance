import { getAccessibleUserIds, getAccountHistory } from '$lib/utils/functions.js';
import pb from '$lib/pocketbase';

let records = $state([]);
let accessibleUserIds = [];

const fetchHistory = async () => {
	const result = await getAccountHistory();
	records = result?.items ?? [];
};

const handleRealtime = (e) => {
	const record = e.record;

	if (!accessibleUserIds.includes(record.user)) return;

	switch (e.action) {
		case 'create':
			records = [record, ...records];
			break;

		case 'delete':
			records = records.filter((r) => r.id !== record.id);
			break;

		case 'update':
			records = records.map((r) => (r.id === record.id ? record : r));
			break;
	}
};

const handleInviteRealtime = async (e) => {
	const record = e.record;
	const userId = pb.authStore.record?.id;

	if (record.from_user !== userId && record.to_user !== userId) return;

	accessibleUserIds = await getAccessibleUserIds();

	await fetchHistory();
};

const init = async () => {
	accessibleUserIds = await getAccessibleUserIds();
	await fetchHistory();
	await pb.collection('account_history').subscribe('*', handleRealtime);
	await pb.collection('shared_invites').subscribe('*', handleInviteRealtime);
};

const cleanup = async () => {
	await pb.collection('account_history').unsubscribe('*');
	await pb.collection('shared_invites').unsubscribe('*');
};

export const accountHistoryStore = {
	get records() {
		return records;
	},
	init,
	cleanup
};
