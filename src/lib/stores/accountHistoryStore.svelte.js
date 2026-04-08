import { getAccountHistory } from '$lib/utils/functions.js';
import pb from '$lib/pocketbase';

let records = $state([]);

const fetchHistory = async () => {
	const result = await getAccountHistory();
	records = result?.items ?? [];
};

const handleRealtime = (e) => {
	const record = e.record;

	if (record.user !== pb.authStore.record?.id) return;

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

const init = async () => {
	await fetchHistory();
	await pb.collection('account_history').subscribe('*', handleRealtime);
};

const cleanup = async () => {
	await pb.collection('account_history').unsubscribe('*');
};

export const accountHistoryStore = {
	get records() {
		return records;
	},
	init,
	cleanup
};
