<script>
	import { DASHBOARD, INCOME, EXPENSES, SETTINGS } from '$lib/utils/constants';
	import BanknoteArrowDownIcon from '@lucide/svelte/icons/banknote-arrow-down';
	import BanknoteArrowUpIcon from '@lucide/svelte/icons/banknote-arrow-up';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import light_logo from '$lib/assets/graphics/light_logo.svg';
	import dark_logo from '$lib/assets/graphics/dark_logo.svg';
	import TabSwitch from '$lib/components/TabSwitch.svelte';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import { active } from '$lib/actions/active.svelte';
	import { logout } from '$lib/utils/functions.js';
	import { resolve } from '$app/paths';

	let { mobile = false, onAction = () => {} } = $props();

	const navItems = $derived([
		{
			page: 'Dashboard',
			icon: LayoutGridIcon,
			link: DASHBOARD
		},
		{
			page: 'Income',
			icon: BanknoteArrowUpIcon,
			link: INCOME + `${INCOMESLUG.value ?? ''}`
		},
		{
			page: 'Expenses',
			icon: BanknoteArrowDownIcon,
			link: EXPENSES + `${EXPENSESLUG.value ?? ''}`
		}
	]);

	const handleClick = () => onAction?.();
</script>

<div
	class={[
		'flex grow flex-col gap-y-13 overflow-y-auto border-grey-300 bg-grey-1000 px-5 py-8 dark:border-grey-300 dark:bg-white-0',
		mobile && 'relative border-r',
		!mobile && 'rounded-30 border'
	]}
>
	<div class={['flex shrink-0 items-center justify-center space-x-2', mobile && 'relative']}>
		<img src={light_logo} alt="Finance logo" class="h-8 w-auto dark:hidden" />
		<img src={dark_logo} alt="Finance logo" class="hidden h-8 w-auto dark:block" />
		<span class="text-preset-7-bold">Finance</span>
	</div>
	<nav aria-label="Primary navigation" class={['flex flex-1 flex-col', mobile && 'relative']}>
		<ul role="list" class="flex flex-1 flex-col gap-y-13">
			<li>
				<ul role="list" class="space-y-1.5">
					{#each navItems as { page, icon: Icon, link }, i (i)}
						<li>
							<a
								href={resolve(link)}
								onclick={handleClick}
								class="text-preset-4-semibold flex items-center gap-x-4.5 rounded-lg bg-transparent p-4 text-grey-50 data-[active=true]:bg-yellow-100 data-[active=true]:text-grey-600 md:transition-colors md:data-[active=false]:hover:text-white-0 dark:text-grey-900 dark:data-[active=true]:bg-yellow-200 dark:data-[active=true]:text-white-0 dark:md:data-[active=false]:hover:text-yellow-200"
								use:active
							>
								<Icon class={['size-5 shrink-0', i === 0 && 'fill-grey-600 dark:fill-white-0']} />
								{page}
							</a>
						</li>
					{/each}
					{#if mobile}
						<li>
							<a
								href={resolve(SETTINGS)}
								onclick={handleClick}
								class="text-preset-4-semibold flex items-center gap-x-4.5 rounded-lg bg-transparent p-4 text-grey-50 data-[active=true]:bg-yellow-100 data-[active=true]:text-grey-600 md:transition-colors md:data-[active=false]:hover:text-white-0 dark:text-grey-900 dark:data-[active=true]:bg-yellow-200 dark:data-[active=true]:text-white-0 dark:md:data-[active=false]:hover:text-yellow-200"
								use:active
							>
								<SettingsIcon class="size-5 shrink-0" />
								Settings
							</a>
						</li>
						<li>
							<button
								type="button"
								onclick={logout}
								aria-label="Logout"
								class="text-preset-4-semibold flex w-full cursor-pointer items-center gap-x-4.5 rounded-lg bg-transparent p-4 text-grey-50 md:transition-colors md:hover:text-white-0 dark:text-grey-900"
							>
								<LogOutIcon class="size-5 shrink-0" />
								Sign out
							</button>
						</li>
					{/if}
				</ul>
			</li>
			<li class="mt-auto">
				<TabSwitch tabItems={['Dark', 'Light']} showIcons={true} />
			</li>
		</ul>
	</nav>
</div>
