<script>
	import {
		states,
		generateSlug,
		cleanNumber,
		payTypes,
		cleanObject,
		calendarDateToISO,
		updateUserIncomeTotal
	} from '$lib/utils/functions.js';
	import { fromDate, getLocalTimeZone } from '@internationalized/date';
	import { incomeStore } from '$lib/stores/incomeStore.svelte.js';
	import { INCOMESLUG } from '$lib/stores/incomeSlug.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormLayout from '$lib/components/FormLayout.svelte';
	import PartOne from '$lib/components/PartOne.svelte';
	import PartTwo from '$lib/components/PartTwo.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { tick } from 'svelte';

	let { handleReset = $bindable(), open = $bindable(), handleEditRecord = $bindable() } = $props();

	let noValue = $state(true);
	let checked = $state(true);
	let indexes = $state({ pay: 0, state: 0 });
	let record = $state({ id: null, update: false });
	let formState = $state({
		step: 1,
		phoneValue: null,
		dateValue: null,
		payDropDown: payTypes[0].value,
		stateDropDown: ''
	});

	const resetState = () => {
		formState.step = 1;
		formState.phoneValue = null;
		formState.dateValue = null;
		formState.payDropDown = payTypes[0].value;
		formState.stateDropDown = '';
		indexes.pay = 0;
		indexes.state = 0;
		record.id = null;
		record.update = false;
		checked = true;
		noValue = true;
	};

	const buildPayload = (values) =>
		cleanObject({
			...values,
			user: pb.authStore.record?.id,
			slug: generateSlug(values.name),
			pay_frequency: formState.payDropDown,
			phone: formState.phoneValue,
			state: formState.stateDropDown,
			date: formState.dateValue ? calendarDateToISO(formState.dateValue) : null,
			status: checked
		});

	const saveRecord = async (values) => {
		const payload = buildPayload(values);

		if (record.update) {
			await pb.collection('incomes').update(record.id, payload);
			const total = await updateUserIncomeTotal(pb.authStore.record.id);
			if (typeof total === 'number') incomeStore.setUserTotal(total);
			await goto(resolve(`${page.url.pathname}#${payload.slug}`));
			INCOMESLUG.value = `#${payload.slug}`;
			toast.success('Successfully updated');
		} else {
			await pb.collection('incomes').create(payload);
			const total = await updateUserIncomeTotal(pb.authStore.record.id);
			if (typeof total === 'number') incomeStore.setUserTotal(total);
			await goto(resolve(`${page.url.pathname}#${payload.slug}`));
			toast.success('Successfully created');
		}
	};

	const { form, reset, isSubmitting, validate, setFields } = createForm({
		initialValues: { name: '', amount: '', email: '', address: '', city: '', zip: '' },
		extend: [validator({ schema: incomeSchema }), reporterDom()],
		transform: (values) => ({ ...values, amount: Number(cleanNumber(values.amount)) || '' }),
		onSubmit: async (values) => {
			try {
				values.amount = toMonthly(values.amount, formState.payDropDown);
				await saveRecord(values);
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
		const keys = ['name', 'amount'];
		const hasErrors = keys.some((key) => (result[key]?.length ?? 0) > 0);
		if (!hasErrors) {
			formState.step += 1;
		}
	};

	const back = () => (formState.step -= 1);

	handleReset = () => resetState();

	handleEditRecord = async (data) => {
		open = true;
		formState.step = 1;
		checked = data?.status;
		formState.phoneValue = data?.phone || null;
		formState.dateValue = data?.date ? fromDate(new Date(data.date), getLocalTimeZone()) : null;
		indexes.pay = payTypes.findIndex((item) => item.value === data?.pay_frequency);
		indexes.state = data?.state?.length ? states.findIndex((x) => x.value === data?.state) : 0;
		noValue = !data?.state?.length;
		await tick();
		record.update = true;
		record.id = data?.id;
		setFields({
			name: data?.name || '',
			amount: fromMonthly(data?.amount, data?.pay_frequency) || '',
			email: data?.email || '',
			address: data?.address || '',
			city: data?.city || '',
			zip: data?.zip || ''
		});
		formState.payDropDown = payTypes[indexes.pay]?.value ?? payTypes[0].value;
		formState.stateDropDown = states[indexes.state]?.value ?? '';
	};

	const toMonthly = (amount, frequency) => {
		if (!amount) return amount;
		switch (frequency) {
			case 'per week':
				return amount * 4;
			case 'bi weekly':
				return amount * 2;
			default:
				return amount;
		}
	};

	const fromMonthly = (amount, frequency) => {
		if (!amount) return amount;
		switch (frequency) {
			case 'per week':
				return amount / 4;
			case 'bi weekly':
				return amount / 2;
			default:
				return amount;
		}
	};
</script>

<FormLayout step={formState.step}>
	<form class="space-y-6.5" use:form>
		<PartOne
			pay={indexes.pay}
			step={formState.step}
			bind:payDropDown={formState.payDropDown}
			bind:checked
		/>
		<PartTwo
			{noValue}
			state={indexes.state}
			step={formState.step}
			bind:phoneValue={formState.phoneValue}
			bind:dateValue={formState.dateValue}
			bind:stateDropDown={formState.stateDropDown}
		/>
		<Dialog.Footer>
			{#if formState.step > 1}
				<Button
					type="button"
					onclick={back}
					class="h-13 flex-1 border border-grey-300 bg-transparent px-6 font-medium md:hover:bg-grey-900 md:dark:hover:bg-gray-200"
				>
					Back
				</Button>
			{/if}
			{#if formState.step < 2}
				<Button
					type="button"
					onclick={next}
					class="h-13 flex-1 border border-grey-300 bg-transparent px-6 font-medium md:hover:bg-grey-900 md:dark:hover:bg-gray-200"
				>
					Continue
				</Button>
			{/if}
			<FormButton disableButton={$isSubmitting} text="Submit" class="flex-1" />
		</Dialog.Footer>
	</form>
</FormLayout>
