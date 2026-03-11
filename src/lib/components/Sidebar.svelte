<script>
	import { DASHBOARD, INCOME, EXPENSES } from '$lib/utils/constants';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import HandCoinsIcon from '@lucide/svelte/icons/hand-coins';
	import TabSwitch from '$lib/components/TabSwitch.svelte';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';
	import { active } from '$lib/actions/active.svelte';
	import logo from '$lib/assets/graphics/logo.svg';
	import { resolve } from '$app/paths';

	let { mobile = false, onAction = () => {} } = $props();
	let currentTab = $state('Dark');

	const navItems = $derived([
		{
			page: 'Dashboard',
			icon: LayoutGridIcon,
			link: DASHBOARD
		},
		{
			page: 'Income',
			icon: HandCoinsIcon,
			link: INCOME + `${INCOMESLUG.value ?? ''}`
		},
		{
			page: 'Expenses',
			icon: ReceiptIcon,
			link: EXPENSES + `${EXPENSESLUG.value ?? ''}`
		}
	]);

	const handleClick = () => onAction?.();
</script>

<div
	class={[
		'flex grow flex-col gap-y-13 overflow-y-auto border-grey-300 bg-grey-1000 px-5 py-8',
		mobile && 'relative border-r',
		!mobile && 'rounded-30 border'
	]}
>
	<div class={['flex shrink-0 items-center justify-center space-x-2', mobile && 'relative']}>
		<img src={logo} alt="Finance logo" class="h-8 w-auto" />
		<span class="text-preset-7-bold text-white-0">Finance</span>
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
								class="text-preset-4-semibold flex items-center gap-x-4.5 rounded-lg bg-transparent p-4 text-grey-50 data-[active=true]:bg-yellow-100 data-[active=true]:text-grey-600 md:transition-colors md:data-[active=false]:hover:text-white-0"
								use:active
							>
								<Icon class={['size-5 shrink-0', i === 0 && 'fill-grey-600']} strokeWidth="1.5" />
								{page}
							</a>
						</li>
					{/each}
				</ul>
			</li>
			<li class="mt-auto">
				<TabSwitch tabItems={['Dark', 'Light']} showIcons={true} bind:currentTab />
			</li>
		</ul>
	</nav>
</div>
