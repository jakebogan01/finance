<script>
	import { getAvatarColor, getInitials, timeAgo } from '$lib/utils/misc.js';

	let { accountHistory = [] } = $props();
</script>

<div
	class="flex max-h-182 flex-col space-y-4 overflow-hidden rounded-30 border border-grey-300 bg-grey-1000 px-2.5 py-4 sm:px-4 lg:flex-1"
>
	<h3 class="text-preset-2">Account History</h3>
	<div
		class="flex flex-col overflow-y-auto rounded-2xl p-1.5 sm:p-2.5 lg:flex-1 {accountHistory?.length >
		0
			? 'bg-grey-400'
			: 'bg-grey-800'}"
	>
		<ul role="list" class="relative space-y-1.5 lg:flex-1">
			{#each accountHistory as item, i (item?.id)}
				<li>
					<div
						class="relative flex items-center justify-between overflow-hidden rounded-2xl border-2 border-grey-900 bg-grey-900 px-4 py-4 sm:px-6 sm:py-5"
					>
						<div class="flex min-w-0 flex-1 items-center gap-x-4">
							<div
								class="text-preset-6-bold relative flex size-12.5 flex-none items-center justify-center rounded-full text-grey-600 {getAvatarColor(
									i
								)}"
							>
								{getInitials()}
							</div>
							<div class="w-full min-w-0 flex-auto">
								<p class="text-preset-3-medium">{item?.title}</p>
								<p class="text-preset-1 text-grey-50">{timeAgo(item?.created)}</p>
							</div>
						</div>
					</div>
				</li>
			{:else}
				<div class="absolute inset-0 flex justify-center items-center gap-x-4">
					<span class="text-preset-3 text-grey-50">No history record</span>
				</div>
			{/each}
		</ul>
	</div>
</div>
