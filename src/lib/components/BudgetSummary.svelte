<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { usdFormatter, logHistory } from '$lib/utils/misc.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase.js';

	let { totalMonthlyExpenses, currentBudget } = $props();

	let value = $derived((currentBudget[0]?.amount || 0) / 100);
	let budget = $derived(Math.round(value) * 100);
	let afterBudget = $derived(budget - totalMonthlyExpenses);

	const handleBudget = async () => {
		try {
			const originalValue = currentBudget[0]?.amount || 0;

			if (currentBudget?.length > 0) {
				await pb.collection('budgets').update(currentBudget[0].id, { amount: budget });
				await updateHistory(originalValue, budget);
			} else {
				await pb.collection('budgets').create({
					original_user_id: pb.authStore.record.id,
					user_id: pb.authStore.record.id,
					amount: budget
				});
				await updateHistory(0, budget);
			}
			await invalidateAll();
			toast.success('Budget successfully updated!');
		} catch (error) {
			console.dir(error?.response, { depth: null });
			toast.error(error?.message ?? 'Could not connect to the server');
		}
	};

	const updateHistory = async (old, updated) => {
		await logHistory({
			type: 'budget_update',
			title: `Updated budget from ${usdFormatter.format(old)} to ${usdFormatter.format(updated)}`,
			meta: { old, updated }
		});
	};
</script>

<Card.Root
	class="flex min-h-50 flex-1 flex-col justify-between space-y-1 rounded-2xl border border-grey-300 bg-grey-1000 py-4! sm:rounded-30 sm:py-5!"
>
	<Card.Header class="px-4! sm:px-5!">
		<Card.Title>Budget Summary</Card.Title>
	</Card.Header>
	<Card.Content>
		<Slider onValueCommit={handleBudget} type="single" bind:value max={100} step={1} />
	</Card.Content>
	<Card.Footer class="px-4! sm:px-5!">
		<div
			class="text-preset-3-medium sm:text-preset-5-medium flex w-full items-center rounded-2xl bg-grey-600 p-1"
		>
			<span class="flex flex-1 items-center justify-center">
				{usdFormatter.format(budget)}
			</span>
			<Separator orientation="vertical" class="h-11.5" />
			<span
				class={[
					'flex flex-1 items-center justify-center',
					afterBudget > 0 ? 'text-green-200' : 'text-red-400'
				]}
			>
				<span>{usdFormatter.format(Math.abs(afterBudget))}</span>
			</span>
		</div>
	</Card.Footer>
</Card.Root>
