import pb from '$lib/pocketbase.js';

export const USERNAME = $state({ value: pb?.authStore?.record?.name || 'User' });
