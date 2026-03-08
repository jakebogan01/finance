<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import { PhoneInput } from '$lib/components/ui/phone-input';
	import FormButton from '$lib/components/FormButton.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { createForm } from 'felte';

	let open = $state(true);
	let step = $state(1);
	let phoneValue = $state(null);
	let dateValue = $state(null);
	const payTypes = [
		{
			value: 'per day',
			label: 'Per Day'
		},
		{
			value: 'per week',
			label: 'Per Week'
		},
		{
			value: 'bi weekly',
			label: 'Bi Weekly'
		},
		{
			value: 'per month',
			label: 'Per Month'
		},
		{
			value: 'semi monthly',
			label: 'Semi Monthly'
		},
		{
			value: 'bi monthly',
			label: 'Bi Monthly'
		},
		{
			value: 'quarterly',
			label: 'Quarterly'
		},
		{
			value: 'semi annually',
			label: 'Semi annually'
		},
		{
			value: 'annually',
			label: 'Annually'
		},
		{
			value: 'on commission',
			label: 'On Commission'
		},
		{
			value: 'on demand',
			label: 'On Demand'
		},
		{
			value: 'irregularly',
			label: 'Irregularly'
		}
	];
	let dropDown = $state(payTypes[0].value);

	const { form, reset, isSubmitting, validate } = createForm({
		initialValues: {
			company_name: '',
			income: '',
			pay: '',
			position: ''
		},
		extend: [validator({ schema: incomeSchema }), reporterDom()],
		transform: (values) => {
			const cleanNumber = (v) => {
				const cleaned = String(v).replace(/\D/g, '');
				return cleaned ? Number(cleaned) : null;
			};

			return {
				...values,
				income: cleanNumber(values.income),
				pay: cleanNumber(values.pay)
			};
		},
		onSubmit: async (values) => {
			try {
				console.log(values);
				console.log(dropDown);
				console.log(phoneValue);
				console.log(dateValue);
				reset();
				phoneValue = null;
				open = false;
				step = 1;
			} catch (error) {
				console.dir(error?.response, { depth: null });
			}
		}
	});

	const next = async () => {
		const result = await validate();
		if (
			(result.company_name === null && result.income === null) ||
			(result.company_name.length === 0 && result.income.length === 0)
		) {
			step += 1;
		}
	};
	const back = () => (step -= 1);
</script>

<div class="flex">
	<Dialog.Root bind:open>
		<Dialog.Trigger
			type="button"
			class="text-grey-0 flex h-13 cursor-pointer items-center gap-2 rounded-full border border-grey-300 bg-grey-1000 px-5! md:hover:border-yellow-200 md:hover:text-yellow-200"
			asChild
		>
			<ArrowRightIcon class="size-6" strokeWidth="1.5" />Add new
		</Dialog.Trigger>

		<Dialog.Content onOpenAutoFocus={(e) => e.preventDefault()}>
			<Dialog.Header class="text-center!">
				<Dialog.Title><span class="text-preset-5 text-grey-50">Add income</span></Dialog.Title>
			</Dialog.Header>

			<div class="flex items-center justify-center space-x-4">
				{#each [1, 2] as s, i (i)}
					<div
						class="text-preset-3-medium flex size-10 items-center justify-center rounded-full border select-none"
						class:border-white-0={step >= s}
						class:border-grey-300={step < s}
					>
						{s}
					</div>
					{#if s === 1}
						<Separator class="max-w-13.5 bg-grey-300" />
					{/if}
				{/each}
			</div>

			<form class="space-y-11.5" use:form>
				<div class:hidden={step !== 1} class="grid grid-cols-6 gap-6.5">
					<div class="col-span-full">
						{@render inputField('Company Name', 'company_name')}
					</div>
					<div class="col-span-2">
						{@render inputField('Income', 'income', 'off', 'text', true)}
					</div>
					<div class="relative col-span-4">
						<Combobox list={payTypes} bind:result={dropDown} />
					</div>
					<div class="relative col-span-3">
						<PhoneInput country="US" placeholder="Phone" bind:value={phoneValue} />
					</div>
					<div class="relative col-span-3">
						<DatePicker bind:value={dateValue} />
					</div>
					<div class="col-span-3">
						{@render inputField('Pay', 'pay', 'off', 'text', true)}
					</div>
					<div class="col-span-3">
						{@render inputField('Position', 'position')}
					</div>
				</div>

				<div class:hidden={step !== 2} class="grid grid-cols-6 gap-6.5">
					<!--					<div class="col-span-full">-->
					<!--						{@render inputField('Company Name', 'company_name', 'off', 'text')}-->
					<!--					</div>-->
					<!--					<div class="col-span-2">-->
					<!--						{@render inputField('Income', 'income', 'off', 'text')}-->
					<!--					</div>-->
				</div>

				<Dialog.Footer>
					{#if step > 1}
						<Button
							type="button"
							onclick={back}
							class="h-13 flex-1 border border-grey-300 bg-transparent font-medium md:hover:bg-grey-900"
						>
							Back
						</Button>
					{/if}
					{#if step < 2}
						<Button
							type="button"
							onclick={next}
							class="h-13 flex-1 border border-grey-300 bg-transparent font-medium md:hover:bg-grey-900"
						>
							Continue
						</Button>
					{/if}
					<FormButton disableButton={$isSubmitting} class="flex-1">
						{#if $isSubmitting}
							<Spinner />
							Validating...
						{:else}
							Submit
						{/if}
					</FormButton>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
