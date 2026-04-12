<script>
	import { getAvatarColor, getInitials, timeAgo } from '$lib/utils/functions.js';
	import { sharedAccessStore } from '$lib/stores/sharedAccessStore.svelte.js';
	import { CopyButton } from '$lib/components/ui/copy-button/index.js';
	import InviteCodeInput from '$lib/components/InviteCodeInput.svelte';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';
	import * as Dialog from '$lib/components/ui/dialog';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase';

	let open = $state(false);

	const handleAccept = async (id) => {
		await sharedAccessStore.acceptInvite(id);
		toast.success('Invite accepted');
	};

	const handleDecline = async (id) => {
		await sharedAccessStore.declineInvite(id);
		toast.success('Invite declined');
	};
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
			<InviteCodeInput bind:open />
		</Dialog.Root>
	</div>
	<div class="flex min-h-0 flex-1 flex-col overflow-y-auto pr-2">
		<ul role="list" class="relative min-h-0 flex-1 space-y-3">
			{#each sharedAccessStore.invites.filter((i) => i.to_user === pb.authStore.record?.id && i.status === 'pending') as invite, i (invite.id)}
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
								{getInitials(invite?.from_name)}
							</div>
							<div class="w-full min-w-0 flex-auto">
								<p class="text-preset-3-medium">
									{invite.from_name} invited to share accounts
								</p>
								<p class="text-preset-1 text-grey-50">{timeAgo(invite?.created)}</p>
								<div class="flex gap-2">
									<button
										type="button"
										onclick={() => handleAccept(invite.id)}
										class="group flex cursor-pointer items-center gap-1 text-green-200 md:transition-colors md:hover:text-white-0"
									>
										<CircleCheckIcon
											class="size-4 text-green-200 md:transition-colors md:group-hover:text-white-0"
											strokeWidth="1.5"
										/>
										Accept
									</button>
									<button
										type="button"
										onclick={() => handleDecline(invite.id)}
										class="group flex cursor-pointer items-center gap-1 text-red-400 md:transition-colors md:hover:text-white-0"
									>
										<CircleXIcon
											class="size-4 text-red-200 md:transition-colors md:group-hover:text-white-0"
											strokeWidth="1.5"
										/>
										Decline
									</button>
								</div>
							</div>
						</div>
					</div>
				</li>
			{/each}
			{#each sharedAccessStore.invites.filter((i) => i.from_user === pb.authStore.record?.id && i.status === 'pending') as invite, i (invite.id)}
				{#if !sharedAccessStore.hasAcceptedInvite(invite.from_user, invite.to_user)}
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
									{getInitials(invite?.to_name)}
								</div>
								<div class="w-full min-w-0 flex-auto">
									<p class="text-preset-3-medium">
										Invite sent to {invite.to_name}
									</p>
									<p class="text-preset-1 text-grey-50">{timeAgo(invite?.created)}</p>
								</div>
							</div>
						</div>
					</li>
				{/if}
			{/each}
			{#each sharedAccessStore.invites.filter((i) => i.status === 'accepted') as invite, i (invite.id)}
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
								{getInitials(invite?.to_name)}
							</div>
							<div class="w-full min-w-0 flex-auto">
								<p class="text-preset-3-medium">
									Account shared with {invite.from_user === pb.authStore.record?.id
										? invite.to_name
										: invite.from_name}
								</p>
								<p class="text-preset-1 text-grey-50">{timeAgo(invite?.created)}</p>
							</div>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
