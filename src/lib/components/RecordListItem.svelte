<script>
	import { usdFormatter, getAvatarColor, getInitials } from '$lib/utils/functions.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { page } from '$app/state';

	let { item = {}, i, handleSlug = () => {} } = $props();
</script>

<li>
	<Command.Item
		class="relative flex items-center justify-between overflow-hidden rounded-2xl border-2 bg-grey-900 px-4 py-4 sm:px-6 sm:py-5 md:transition-colors md:duration-300 dark:bg-white {page
			.url.hash === `#${item?.slug}`
			? 'border-yellow-200'
			: 'border-grey-900 md:hover:border-yellow-100 dark:border-gray-300'}"
	>
		<div class="flex min-w-0 gap-x-4 sm:gap-x-7">
			<div
				class="relative flex size-12.5 flex-none items-center justify-center rounded-full {getAvatarColor(
					i
				)}"
			>
				<span class="text-preset-6-bold text-grey-600 uppercase dark:text-grey-600"
					>{item?.name?.[0] || item?.title?.[0]}</span
				>
				<div
					class="absolute top-7.5 -right-1.5 flex size-7.5 items-center justify-center rounded-full bg-grey-1100 dark:bg-yellow-200"
				>
					<span class="text-preset-1 text-white-0">JB</span>
				</div>
			</div>
			<div class="min-w-0 flex-auto">
				<p
					class="text-preset-3-medium max-w-50 truncate text-white-0 sm:max-w-full lg:max-w-70 dark:text-gray-900"
				>
					<a href={`#${item?.slug}`} onclick={() => handleSlug(item?.slug)}>
						<span class="absolute inset-x-0 -top-px bottom-0"></span>
						{item?.name || item?.title}
					</a>
				</p>
				<p class="text-white-0 dark:text-grey-500">
					{usdFormatter.format(item?.amount || item?.expand?.current_history?.amount)}
					<span class="text-preset-1 text-grey-50 capitalize dark:text-grey-500"
						>{item?.pay_frequency || 'Per Month'}</span
					>
				</p>
			</div>
		</div>
		<div
			class="flex size-3 flex-none shrink-0 flex-col items-end rounded-full {item?.status
				? 'bg-yellow-200 dark:bg-yellow-200/80'
				: 'bg-grey-200 dark:bg-grey-300'}"
		></div>
	</Command.Item>
</li>
