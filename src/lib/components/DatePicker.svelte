<script>
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import CalendarDaysIcon from '@lucide/svelte/icons/calendar-days';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { value = $bindable(null) } = $props();

	const id = $props.id();
	let open = $state(false);
	let dateValue = $derived(value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : 'Date');
</script>

<div class="flex flex-col gap-3">
	<label for="{id}-date" class="sr-only">Start Date</label>
	<Popover.Root bind:open>
		<Popover.Trigger id="{id}-date">
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class={[
						'h-13 w-full justify-between rounded-lg border border-grey-300 bg-grey-900 px-2! sm:px-4! md:hover:border-yellow-200 dark:border-grey-400 dark:bg-white-0',
						value ? 'text-white-0 dark:text-grey-900' : 'text-grey-200 dark:text-grey-500'
					]}
				>
					{dateValue}
					<CalendarDaysIcon class="text-grey-200 dark:text-grey-500" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto overflow-hidden p-0" align="end">
			<Calendar
				type="single"
				bind:value
				captionLayout="dropdown"
				onValueChange={() => (open = false)}
				maxValue={today(getLocalTimeZone())}
			/>
		</Popover.Content>
	</Popover.Root>
</div>
