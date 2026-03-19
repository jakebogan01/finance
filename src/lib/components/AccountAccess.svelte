<script>
	import { getAvatarColor, getInitials, timeAgo } from '$lib/utils/misc.js';
	import { CopyButton } from '$lib/components/ui/copy-button/index.js';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import InviteForm from '$lib/components/InviteForm.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';
	import Clock4Icon from '@lucide/svelte/icons/clock-4';
	import * as Dialog from '$lib/components/ui/dialog';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase';

	let { accountHistory = [], invites = [] } = $props();

	let open = $state(false);
	const userId = pb?.authStore?.record?.id;

	const respond = async (invite, status) => {
		try {
			await pb.collection('shared_invites').update(invite.id, { status });
			toast.success(`Invite ${status}`);
			await invalidateAll();
		} catch (error) {
			console.dir(error?.response, { depth: null });
			toast.error(error?.message ?? 'Could not connect to the server');
		}
	};

	const remove = async (invite) => {
		try {
			await pb.collection('shared_invites').delete(invite.id);
			toast.success(`No longer sharing accounts`);
			await invalidateAll();
		} catch (error) {
			console.dir(error?.response, { depth: null });
			toast.error(error?.message ?? 'Could not connect to the server');
		}
	};
</script>

<Dialog.Root bind:open>
	<div
		class="flex flex-col space-y-4 overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 px-2.5 py-4 sm:max-h-182 sm:rounded-30 sm:px-4 lg:flex-1"
	>
		<div class="flex items-center justify-between">
			<div>
				<h3 class="text-preset-4-semibold sm:text-preset-5-semibold">Account Access</h3>
				<CopyButton
					text={pb?.authStore?.record?.invite_code}
					size="sm"
					variant="ghost"
					class="text-preset-1 h-auto! gap-1! px-0! whitespace-normal!"
				>
					{#snippet icon()}
						<CopyIcon class="size-3" strokeWidth="1.5" />
					{/snippet}
					<span class="text-gray-300 dark:text-gray-500">
						{pb?.authStore?.record?.invite_code}
					</span>
				</CopyButton>
			</div>
			<Dialog.Trigger
				onclick={() => (open = true)}
				type="button"
				class="h-13 cursor-pointer rounded-lg bg-yellow-200 px-6 font-medium text-grey-600 sm:w-auto md:hover:bg-yellow-100"
			>
				Invite
			</Dialog.Trigger>
		</div>
		<div
			class="flex flex-col overflow-y-auto rounded-2xl p-1.5 sm:p-2.5 lg:flex-1 {accountHistory?.length >
			0
				? 'bg-grey-400'
				: 'bg-grey-800 dark:bg-gray-300'}"
		>
			<ul role="list" class="relative min-h-32 space-y-1.5 lg:flex-1">
				{#each invites as invite, i (invite?.id)}
					<li>
						<div
							class="relative flex flex-col overflow-hidden rounded-2xl border-2 border-grey-900 bg-grey-900 px-4 py-4 sm:px-6 sm:py-5"
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
									{#if invite.to_user === userId}
										<p class="text-preset-3-medium">
											{#if invite.status === 'accepted'}
												Sharing accounts with {invite?.from_name}
											{:else}
												{invite?.from_name} wants to share accounts
											{/if}
										</p>
									{:else}
										<p class="text-preset-3-medium">
											{#if invite.status === 'accepted'}
												Sharing accounts with {invite?.to_name}
											{:else}
												Invite sent to {invite?.to_name}
											{/if}
										</p>
									{/if}
									<div class="mt-1.5 flex items-center gap-x-2">
										{#if invite.status === 'pending'}
											<Badge variant="outline">
												<CircleCheckIcon />
												Pending
											</Badge>
										{:else if invite.status === 'accepted'}
											<Badge class="bg-green-700">
												<Clock4Icon />
												Accepted
											</Badge>
										{:else}
											<Badge class="bg-red-200">
												<CircleXIcon />
												Declined
											</Badge>
										{/if}
										<p class="text-preset-1 text-grey-50">{timeAgo(invite?.created)}</p>
									</div>
								</div>
							</div>
							{#if invite.to_user === userId && invite.status === 'pending'}
								<div class="mt-2 ml-16 flex items-center gap-x-3">
									<button
										type="button"
										onclick={() => respond(invite, 'accepted')}
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
										onclick={() => respond(invite, 'declined')}
										class="group flex cursor-pointer items-center gap-1 text-red-400 md:transition-colors md:hover:text-white-0"
									>
										<CircleXIcon
											class="size-4 text-red-200 md:transition-colors md:group-hover:text-white-0"
											strokeWidth="1.5"
										/>
										Decline
									</button>
								</div>
							{:else}
								<div class="mt-2 ml-16 flex items-center gap-x-3">
									<button
										type="button"
										onclick={() => remove(invite)}
										class="group flex cursor-pointer items-center gap-1 text-red-400 md:transition-colors md:hover:text-white-0"
									>
										<CircleXIcon
											class="size-4 text-red-200 md:transition-colors md:group-hover:text-white-0"
											strokeWidth="1.5"
										/>
										Delete
									</button>
								</div>
							{/if}
						</div>
					</li>
				{:else}
					<div class="absolute inset-0 flex justify-center items-center gap-x-4">
						<span class="text-preset-3 text-grey-50">No shared records</span>
					</div>
				{/each}
			</ul>
		</div>
	</div>

	<InviteForm bind:open />
</Dialog.Root>
