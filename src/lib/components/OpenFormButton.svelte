<script>
	import {
		states,
		payTypes,
		categories,
		cleanObject,
		generateSlug,
		calendarDateToISO
	} from '$lib/utils/misc.js';
	import { getLocalTimeZone, fromDate } from '@internationalized/date';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import { PhoneInput } from '$lib/components/ui/phone-input';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import { page } from '$app/state';
	import { tick } from 'svelte';

	let { title, multiStepForm = true, schema, handleEditRecord = $bindable(), data } = $props();

	let open = $state(false);
	let noValue = $state(false);

	const now = new Date();
	const month = now.getMonth() + 1;
	const year = now.getFullYear();

	let indexes = $state({
		pay: 0,
		state: 0,
		category: 0
	});

	let record = $state({
		id: null,
		update: false
	});

	let formState = $state({
		step: 1,
		phoneValue: null,
		dateValue: null,
		payDropDown: payTypes[0].value,
		stateDropDown: '',
		categoryDropDown: categories[0].value
	});

	const cleanNumber = (v) => {
		const cleaned = String(v).replace(/\D/g, '');
		return cleaned ? Number(cleaned) : null;
	};

	const resetState = () => {
		formState.step = 1;
		formState.phoneValue = null;
		formState.dateValue = null;

		formState.payDropDown = payTypes[0].value;
		formState.stateDropDown = '';
		formState.categoryDropDown = categories[0].value;

		indexes.pay = 0;
		indexes.state = 0;
		indexes.category = 0;

		record.id = null;
		record.update = false;

		noValue = true;
	};

	const buildPayload = (values) => {
		values.user_id = pb?.authStore?.record?.id;
		values.slug = generateSlug(values.company_name || values.title);
		values.status = true;

		values.recurring = formState.payDropDown;
		values.company_state = formState.stateDropDown;
		values.company_phone = formState.phoneValue;
		values.category = formState.categoryDropDown;
		values.start_date = calendarDateToISO(formState.dateValue);

		return cleanObject(values);
	};

	const createExpenseHistory = async (collection, record, amount) => {
		const history = await pb.collection('expense_history').create({
			expense: record.id,
			created_by: pb?.authStore?.record?.id,
			amount: amount,
			month: month,
			year: year
		});

		await pb.collection(collection).update(record.id, {
			current_history: history.id
		});
	};

	const updateExpenseHistory = async (collection, record, amount) => {
		const current = data?.expand?.current_history;

		if (current.month === month && current.year === year) {
			await pb.collection('expense_history').update(current.id, { amount: amount });
		} else {
			await createExpenseHistory(collection, record, amount);
		}
	};

	const saveRecord = async (values) => {
		const payload = buildPayload(values);
		const collection = multiStepForm ? 'income' : 'expenses';

		if (record.update) {
			payload.account_email = payload.account_email || '';
			const record = await pb.collection(collection).update(data.id, payload);
			if (collection === 'expenses') {
				await updateExpenseHistory(collection, record, values.amount);
			}

			await goto(resolve(`${page.url.pathname}#${payload.slug}`));

			if (multiStepForm) {
				INCOMESLUG.value = `#${payload.slug}`;
			} else {
				EXPENSESLUG.value = `#${payload.slug}`;
			}
		} else {
			const record = await pb.collection(collection).create(payload);
			if (collection === 'expenses') {
				await createExpenseHistory(collection, record, values.amount);
			}
		}
	};

	const { form, reset, isSubmitting, validate, setFields } = createForm({
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

		transform: (values) => ({
			...values,
			income: cleanNumber(values.income),
			pay: cleanNumber(values.pay),
			amount: cleanNumber(values.amount)
		}),

		onSubmit: async (values) => {
			try {
				await saveRecord(values);

				await invalidateAll();

				reset();
				resetState();
				open = false;
			} catch (error) {
				console.dir(error?.response, { depth: null });
				toast.error(error?.message ?? 'Could not connect to the server');
			}
		}
	});

	const next = async () => {
		const result = await validate();

		const keys = ['company_name', 'income', 'pay', 'position'];

		const allEmpty = keys.every((key) => result[key] === null || result[key]?.length === 0);

		if (allEmpty) formState.step += 1;
	};

	const back = () => {
		formState.step -= 1;
	};

	handleEditRecord = async (data) => {
		open = true;
		formState.step = 1;

		formState.phoneValue = data?.company_phone || null;

		const startDate = data?.start_date ? new Date(data.start_date) : null;

		formState.dateValue =
			startDate && !isNaN(startDate.getTime()) ? fromDate(startDate, getLocalTimeZone()) : null;

		indexes.pay = payTypes.findIndex((x) => x.value === data?.recurring);
		indexes.category = categories.findIndex((x) => x.value === data?.category);

		if (data?.company_state?.length) {
			noValue = false;
			indexes.state = states.findIndex((x) => x.value === data?.company_state);
		} else {
			noValue = true;
		}

		await tick();

		record.update = true;
		record.id = data?.id;

		setFields({
			company_name: data?.company_name || '',
			income: data?.income || '',
			company_email: data?.company_email || '',
			pay: data?.pay || '',
			position: data?.position || '',
			manager_name: data?.manager_name || '',
			company_address: data?.company_address || '',
			company_city: data?.company_city || '',
			company_zip: data?.company_zip || '',
			title: data?.title || '',
			amount: data?.expand?.current_history?.amount || '',
			account_email: data?.account_email || ''
		});

		formState.payDropDown = payTypes[indexes.pay]?.value ?? payTypes[0].value;
		formState.stateDropDown = states[indexes.state]?.value ?? '';
		formState.categoryDropDown = categories[indexes.category]?.value ?? categories[0].value;
	};
</script>

<div class="flex">
	<Dialog.Root bind:open>
		<Dialog.Trigger
			type="button"
			onclick={resetState}
			class="flex h-13 cursor-pointer items-center gap-2 rounded-full border border-grey-300 bg-grey-1000 px-5! text-white-0 md:hover:border-yellow-200 md:hover:text-yellow-200"
			asChild
		>
			<ArrowRightIcon class="size-6" strokeWidth="1.5" />
			Add new
		</Dialog.Trigger>

		<Dialog.Content>
			<Dialog.Header class={[multiStepForm ? 'text-center' : 'text-left']}>
				<Dialog.Title>
					<span class="text-preset-5-semibold">{title}</span>
				</Dialog.Title>
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
								index={indexes.pay}
								defaultText="Recurring"
							/>
						</div>
						<div class="col-span-2">
							{@render inputField('Pay', 'pay', 'off', 'text', true)}
						</div>
						<div class="col-span-4">
							{@render inputField('Position', 'position')}
						</div>
					</div>
					<div class:hidden={formState.step !== 2} class="grid grid-cols-6 gap-6.5">
						<div class="col-span-full">
							{@render inputField('Company Email (Opt.)', 'company_email', 'email', 'email')}
						</div>
						<div class="relative col-span-3">
							<PhoneInput
								country="US"
								placeholder="Phone (Opt.)"
								bind:value={formState.phoneValue}
							/>
						</div>
						<div class="relative col-span-3">
							<DatePicker bind:value={formState.dateValue} />
						</div>
						<div class="col-span-full">
							{@render inputField('Managers Name (Opt.)', 'manager_name')}
						</div>
						<div class="col-span-full">
							{@render inputField('Street Address (Opt.)', 'company_address', 'address-line1')}
						</div>
						<div class="col-span-full">
							{@render inputField('City (Opt.)', 'company_city', 'address-level2')}
						</div>
						<div class="relative col-span-3">
							<Combobox
								list={states}
								bind:result={formState.stateDropDown}
								defaultText="State (Opt.)"
								{noValue}
								index={indexes.state}
								class="ml-18 w-[56%]"
							/>
						</div>
						<div class="col-span-3">
							{@render inputField(
								'Zip (Opt.)',
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
					<div class="grid grid-cols-6 gap-6.5">
						<div class="col-span-full">
							{@render inputField('Title', 'title')}
						</div>
						<div class="col-span-full">
							{@render inputField('Amount', 'amount', 'off', 'text', true)}
						</div>
						<div class="relative col-span-3">
							<Combobox
								list={categories}
								bind:result={formState.categoryDropDown}
								index={indexes.category}
								defaultText="Category"
							/>
						</div>
						<div class="relative col-span-3">
							<Combobox
								list={payTypes}
								bind:result={formState.payDropDown}
								index={indexes.pay}
								defaultText="Recurring"
							/>
						</div>
						<div class="col-span-full">
							{@render inputField('Account Email (Opt.)', 'account_email', 'email', 'email')}
						</div>
					</div>
				{/if}
				<Dialog.Footer>
					{#if formState.step > 1}
						<Button
							type="button"
							onclick={back}
							class="h-13 flex-1 border border-grey-300 bg-transparent px-6 font-medium md:hover:bg-grey-900"
						>
							Back
						</Button>
					{/if}
					{#if formState.step < 2 && multiStepForm}
						<Button
							type="button"
							onclick={next}
							class="h-13 flex-1 border border-grey-300 bg-transparent px-6 font-medium md:hover:bg-grey-900"
						>
							Continue
						</Button>
					{:else if !multiStepForm}
						<Dialog.Close
							type="button"
							class="h-13 flex-1 cursor-pointer rounded-lg border border-grey-300 bg-transparent px-6 font-medium text-white-0 md:hover:bg-grey-900"
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
