<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { states, payTypes, categories } from '$lib/utils/misc.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import { PhoneInput } from '$lib/components/ui/phone-input';
	import FormButton from '$lib/components/FormButton.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { createForm } from 'felte';

	let { title, multiStepForm = true, schema } = $props();
	let open = $state(false);
	let formState = $state({
		step: 1,
		phoneValue: null,
		dateValue: null,
		payDropDown: payTypes[0].value,
		stateDropDown: states[0].value,
		categoryDropDown: categories[0].value
	});

	const { form, reset, isSubmitting, validate } = createForm({
		initialValues: {
			company_name: '',
			income: '',
			company_email: '',
			pay: '',
			position: '',
			manager_name: '',
			company_address: '',
			company_city: '',
			company_zip: '',
			title: '',
			amount: '',
			account_email: ''
		},
		extend: [validator({ schema }), reporterDom()],
		transform: (values) => {
			const cleanNumber = (v) => {
				const cleaned = String(v).replace(/\D/g, '');
				return cleaned ? Number(cleaned) : null;
			};

			return {
				...values,
				income: cleanNumber(values.income),
				pay: cleanNumber(values.pay),
				amount: cleanNumber(values.amount)
			};
		},
		onSubmit: async (values) => {
			try {
				console.log(values);
				console.log(formState.payDropDown);
				console.log(formState.stateDropDown);
				console.log(formState.categoryDropDown);
				console.log(formState.phoneValue);
				console.log(formState.dateValue);
				reset();
				formState.phoneValue = null;
				formState.dateValue = null;
				open = false;
				formState.step = 1;
			} catch (error) {
				console.dir(error?.response, { depth: null });
			}
		}
	});

	const next = async () => {
		const result = await validate();
		const keysToCheck = ['company_name', 'income', 'pay', 'position'];
		const allEmptyOrNull = keysToCheck.every(
			(key) => result[key] === null || result[key]?.length === 0
		);
		if (allEmptyOrNull) formState.step += 1;
	};
	const back = () => (formState.step -= 1);
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
			<Dialog.Header class={[multiStepForm ? 'text-center' : 'text-left']}>
				<Dialog.Title><span class="text-preset-5-semibold">{title}</span></Dialog.Title>
				{#if !multiStepForm}
					<Dialog.Description>This can be either a bill or a subscription</Dialog.Description>
				{/if}
			</Dialog.Header>

			{#if multiStepForm}
				<div class="flex items-center justify-center space-x-4">
					{#each [1, 2] as s, i (i)}
						<div
							class="text-preset-3-medium flex size-10 items-center justify-center rounded-full border select-none"
							class:border-white-0={formState.step >= s}
							class:border-grey-300={formState.step < s}
						>
							{s}
						</div>
						{#if s === 1}
							<Separator class="max-w-13.5 bg-grey-300" />
						{/if}
					{/each}
				</div>
			{/if}

			<form class="space-y-6.5" use:form>
				{#if multiStepForm}
					<div class:hidden={formState.step !== 1} class="grid grid-cols-6 gap-6.5">
						<div class="col-span-full">
							{@render inputField('Company Name', 'company_name')}
						</div>
						<div class="col-span-2">
							{@render inputField('Income', 'income', 'off', 'text', true)}
						</div>
						<div class="relative col-span-4">
							<Combobox
								list={payTypes}
								bind:result={formState.payDropDown}
								defaultText="Recurring"
							/>
						</div>
						<div class="col-span-3">
							{@render inputField('Pay', 'pay', 'off', 'text', true)}
						</div>
						<div class="col-span-3">
							{@render inputField('Position', 'position')}
						</div>
					</div>

					<div class:hidden={formState.step !== 2} class="grid grid-cols-6 gap-6.5">
						<div class="col-span-full">
							{@render inputField(
								'Company Email',
								'company_email',
								'email',
								'email',
								false,
								'email'
							)}
						</div>
						<div class="relative col-span-3">
							<PhoneInput country="US" placeholder="Phone" bind:value={formState.phoneValue} />
						</div>
						<div class="relative col-span-3">
							<DatePicker bind:value={formState.dateValue} />
						</div>
						<div class="col-span-full">
							{@render inputField('Managers Name', 'manager_name')}
						</div>
						<div class="col-span-full">
							{@render inputField('Street Address', 'company_address', 'address-line1')}
						</div>
						<div class="col-span-full">
							{@render inputField('City', 'company_city', 'address-level2')}
						</div>
						<div class="relative col-span-3">
							<Combobox
								list={states}
								bind:result={formState.stateDropDown}
								defaultText="States"
								class="ml-18 w-[56%]"
							/>
						</div>
						<div class="col-span-3">
							{@render inputField(
								'Zip Code',
								'company_zip',
								'postal-code',
								'text',
								false,
								'numeric',
								true
							)}
						</div>
					</div>
				{:else}
					<div class:hidden={formState.step !== 1} class="grid grid-cols-6 gap-6.5">
						<div class="col-span-full">
							{@render inputField('Title', 'title')}
						</div>
						<div class="col-span-3">
							{@render inputField('Amount', 'amount', 'off', 'text', true)}
						</div>
						<div class="relative col-span-3">
							<Combobox
								list={categories}
								bind:result={formState.categoryDropDown}
								defaultText="Category"
							/>
						</div>
						<div class="col-span-full">
							{@render inputField(
								'Account Email (optional)',
								'account_email',
								'email',
								'email',
								false,
								'email'
							)}
						</div>
					</div>
				{/if}

				<Dialog.Footer>
					{#if formState.step > 1}
						<Button
							type="button"
							onclick={back}
							class="h-13 flex-1 border border-grey-300 bg-transparent font-medium md:hover:bg-grey-900"
						>
							Back
						</Button>
					{/if}
					{#if formState.step < 2 && multiStepForm}
						<Button
							type="button"
							onclick={next}
							class="h-13 flex-1 border border-grey-300 bg-transparent font-medium md:hover:bg-grey-900"
						>
							Continue
						</Button>
					{:else if !multiStepForm}
						<Dialog.Close
							type="button"
							class="h-13 flex-1 cursor-pointer rounded-lg border border-grey-300 bg-transparent font-medium text-white-0 md:transition-colors md:hover:bg-grey-900"
						>
							Cancel
						</Dialog.Close>
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
