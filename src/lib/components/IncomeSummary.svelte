<script>
    import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
    import { Separator } from '$lib/components/ui/separator/index.js';
    import CircleButton from '$lib/components/CircleButton.svelte';
    import * as Card from '$lib/components/ui/card/index.js';
    import { usdFormatter } from '$lib/utils/misc.js';
    import { INCOME } from "$lib/utils/constants.js";
    import { resolve } from "$app/paths";

    let { totalMonthlyIncome, totalMonthlyExpenses, remainingIncome } = $props();
</script>

<Card.Root class="py-4! sm:py-5! flex flex-1 flex-col space-y-1 bg-linear-to-b from-grey-1000 to-grey-800">
    <Card.Header class="px-4! sm:px-5!">
        <Card.Title>Monthly Summary</Card.Title>
        <Card.Description class="text-preset-1">
            <span class="text-grey-50">- {usdFormatter.format(totalMonthlyExpenses)} Expenses</span>
        </Card.Description>
        <Card.Action>
            <CircleButton href={resolve(INCOME)} Icon={ArrowUpRightIcon} size="6" />
        </Card.Action>
    </Card.Header>
    <Card.Footer  class="px-4! sm:px-5! flex-1">
        <div class="text-preset-3-medium sm:text-preset-5-medium flex w-full items-center rounded-2xl bg-grey-600 p-1">
            <span class="flex flex-1 items-center justify-center">
                {usdFormatter.format(totalMonthlyIncome)}
            </span>
            <Separator orientation="vertical" class="h-11.5" />
            <span class={['flex flex-1 items-center justify-center', remainingIncome > 0 ? 'text-green-200' : 'text-red-200']}>
                {usdFormatter.format(remainingIncome)}
            </span>
        </div>
    </Card.Footer>
</Card.Root>