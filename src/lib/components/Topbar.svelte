<script>
	import CircleButton from '$lib/components/CircleButton.svelte';
	import { USERNAME } from '$lib/stores/userName.svelte.js';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import { LOGOUT, SETTINGS } from '$lib/utils/constants';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import Avatar from '$lib/components/Avatar.svelte';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { page } from '$app/state';

	let { invites = [] } = $props();

	const pendingInvites = $derived(invites.filter((item) => item.status === 'pending'));

	const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path fill-rule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clip-rule="evenodd" /></svg>`;
</script>

<div
	class="sticky top-0 z-40 flex shrink-0 items-center justify-between rounded-2xl border border-grey-300 bg-grey-1000 px-4 py-4 sm:rounded-20 sm:px-5 xl:static"
>
	<div class="flex items-center justify-center space-x-3 sm:space-x-6">
		<Avatar />
		<div>
			<p class="text-preset-2">Welcome!</p>
			<p class="text-preset-5-medium sm:text-3xl">{USERNAME.value}</p>
		</div>
	</div>
	<div class="flex items-center gap-3">
		{#if page.url.pathname !== SETTINGS}
			{#if pendingInvites[0]?.to_user === pb?.authStore?.record?.id && pendingInvites?.length > 0}
				<CircleButton
					href={resolve(SETTINGS)}
					{content}
					size="6"
					class="hidden text-red-400 xl:flex"
				/>
			{:else}
				<CircleButton
					href={resolve(SETTINGS)}
					Icon={SettingsIcon}
					size="6"
					class="hidden xl:flex"
				/>
			{/if}
		{:else}
			<CircleButton
				onclick={() => goto(resolve(LOGOUT))}
				Icon={LogOutIcon}
				size="6"
				class="hidden xl:flex"
			/>
		{/if}
		<CircleButton
			command="show-modal"
			commandfor="sidebar"
			Icon={MenuIcon}
			size="6"
			class="xl:hidden"
		/>
	</div>
</div>
