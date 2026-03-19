<script>
	import { getAvatarColor, getInitials, timeAgo } from '$lib/utils/misc.js';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';
	import Clock4Icon from '@lucide/svelte/icons/clock-4';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase';

	let { accountHistory = [], invites = [] } = $props();

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

<div
	class="flex max-h-182 flex-col space-y-4 overflow-hidden rounded-30 border border-grey-300 bg-grey-1000 px-2.5 py-4 sm:px-4 lg:flex-1"
>
	<h3 class="text-preset-5-semibold">Account Access</h3>
	<div
		class="flex flex-col overflow-y-auto rounded-2xl p-1.5 sm:p-2.5 lg:flex-1 {accountHistory?.length >
		0
			? 'bg-grey-400'
			: 'bg-grey-800'}"
	>
		<ul role="list" class="relative space-y-1.5 lg:flex-1">
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
