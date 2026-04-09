<script>
	import { getAvatarColor, getInitials, timeAgo } from '$lib/utils/functions.js';
	import { CopyButton } from '$lib/components/ui/copy-button/index.js';
	import InviteCodeInput from '$lib/components/InviteCodeInput.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import pb from '$lib/pocketbase';

	let { accountHistory = [] } = $props();

	let open = $state(false);
</script>

<div
	class="flex max-h-125 min-h-0 flex-1 flex-col space-y-4 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 py-4 pr-3 pl-4 sm:rounded-3xl sm:py-5 sm:pl-5 lg:max-h-none dark:bg-white-0"
>
	<div class="flex items-center justify-between">
		<div>
			<h3 class="font-semibold sm:text-lg dark:text-grey-600">Account Access</h3>
			<CopyButton
				text={pb.authStore.record?.invite_code}
				size="sm"
				variant="ghost"
				class="text-preset-1 h-auto! gap-1! px-0! whitespace-normal!"
			>
				{#snippet icon()}
					<CopyIcon class="size-3 text-grey-50 dark:text-grey-600" strokeWidth="1.5" />
				{/snippet}
				<span class="text-grey-50 dark:text-grey-600">
					{pb.authStore.record?.invite_code}
				</span>
			</CopyButton>
		</div>
		<Dialog.Root bind:open>
			<Dialog.Trigger
				type="button"
				onclick={() => (open = true)}
				class={[
					'h-13 cursor-pointer rounded-lg bg-yellow-200 px-6 font-medium text-grey-600 sm:w-auto md:hover:bg-yellow-100 dark:text-white-0'
				]}
				asChild
			>
				Invite
			</Dialog.Trigger>
			<InviteCodeInput />
		</Dialog.Root>
	</div>
	<div class="flex min-h-0 flex-1 flex-col overflow-y-auto pr-2">
		<ul role="list" class="relative min-h-0 flex-1 space-y-3">
			{#each accountHistory as item, i (item?.id)}
				<li>
					<div
						class="relative flex items-center justify-between overflow-hidden rounded-2xl border-2 border-grey-900 bg-grey-900 px-4 py-4 sm:px-6 sm:py-5 dark:border-gray-400/60 dark:bg-white"
					>
						<div class="flex min-w-0 flex-1 items-center gap-x-4">
							<div
								class="text-preset-6-bold relative flex size-12.5 flex-none items-center justify-center rounded-full text-grey-600 {getAvatarColor(
									i
								)}"
							>
								{getInitials(item?.owner)}
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
					<span class="text-preset-3 text-grey-200 dark:text-grey-400">No shared accounts</span>
				</div>
			{/each}
		</ul>
	</div>
</div>
