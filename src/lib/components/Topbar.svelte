<script>
	import CircleButton from '$lib/components/CircleButton.svelte';
	import { USERNAME } from '$lib/stores/userName.svelte.js';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import Avatar from '$lib/components/Avatar.svelte';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import { SETTINGS } from '$lib/utils/constants';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<div
	class="sticky top-0 z-40 flex shrink-0 items-center justify-between rounded-2xl border border-grey-300 bg-grey-1000 px-4 py-4 sm:rounded-20 sm:px-5 xl:static"
>
	<div class="flex items-center justify-center space-x-6">
		<Avatar />
		<div>
			<p class="text-preset-2">Welcome!</p>
			<p class="text-preset-5-medium sm:text-3xl">{USERNAME.value}</p>
		</div>
	</div>
	<CircleButton
		command="show-modal"
		commandfor="sidebar"
		Icon={MenuIcon}
		size="6"
		class="xl:hidden"
	/>
	{#if page.url.pathname !== SETTINGS}
		<CircleButton href={resolve(SETTINGS)} Icon={SettingsIcon} size="6" class="hidden xl:flex" />
	{/if}
</div>
