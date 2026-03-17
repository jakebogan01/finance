<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { usdFormatter } from '$lib/utils/misc.js';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase.js';

	let { totalMonthlyExpenses, currentBudget } = $props();

	let value = $derived((currentBudget[0]?.amount || 0) / 100);
	let budget = $derived(Math.round(value) * 100);
	let afterBudget = $derived(budget - totalMonthlyExpenses);

	const handleBudget = async () => {
		try {
			if (currentBudget?.length > 0) {
				await pb.collection('budgets').update(currentBudget[0].id, { amount: budget });
			} else {
				await pb.collection('budgets').create({
					user_id: pb.authStore.record.id,
					amount: budget
				});
			}
			await invalidateAll();
			toast.success('Budget successfully updated!');
		} catch (error) {
			console.dir(error?.response, { depth: null });
			toast.error(error?.message ?? 'Could not connect to the server');
		}
	};
</script>

<Card.Root
	class="flex flex-1 flex-col justify-between space-y-1 bg-linear-to-b from-grey-1000 to-grey-800 py-4! sm:py-5!"
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
					afterBudget > 0 ? 'text-green-200' : 'text-red-200'
				]}
			>
				<span>{usdFormatter.format(Math.abs(afterBudget))}</span>
			</span>
		</div>
	</Card.Footer>
</Card.Root>
