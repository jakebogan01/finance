import pb from '$lib/pocketbase';

let invites = $state([]);
let users = $state([]);

const fetchInvites = async () => {
	const userId = pb.authStore.record?.id;

	if (!userId) return;

	invites = await pb.collection('shared_invites').getFullList({
		filter: `from_user="${userId}" || to_user="${userId}"`,
		expand: 'from_user,to_user',
		sort: '-created',
		$autoCancel: false
	});
};

const handleRealtime = async (e) => {
	const record = e.record;
	const userId = pb.authStore.record?.id;

	if (!userId) return;

	const isRelevant = record.from_user === userId || record.to_user === userId;

	if (!isRelevant) return;

	const fresh = await pb.collection('shared_invites').getFullList({
		filter: `from_user="${userId}" || to_user="${userId}"`,
		expand: 'from_user,to_user',
		sort: '-created',
		$autoCancel: false
	});

	invites = [];
	invites = [...fresh];
};

const hasAcceptedInvite = (fromUser, toUser) => {
	return invites.some(
		(i) => i.from_user === fromUser && i.to_user === toUser && i.status === 'accepted'
	);
};

const acceptInvite = async (inviteId) => {
	await pb.collection('shared_invites').update(inviteId, {
		status: 'accepted',
		$autoCancel: false
	});

	await pb.collection('account_history').create({
		user: pb.authStore.record?.id,
		type: 'invite_accepted',
		title: 'Accepted account invite',
		$autoCancel: false
	});

	await fetchInvites();
};

const declineInvite = async (inviteId) => {
	await pb.collection('shared_invites').update(inviteId, {
		status: 'declined',
		$autoCancel: false
	});

	await fetchInvites();
};

const init = async () => {
	await fetchInvites();

	await pb.collection('shared_invites').subscribe('*', handleRealtime);
};

const cleanup = async () => {
	await pb.collection('shared_invites').unsubscribe('*');
};

export const sharedAccessStore = {
	get invites() {
		return invites;
	},
	init,
	cleanup,
	acceptInvite,
	declineInvite,
	hasAcceptedInvite
};
