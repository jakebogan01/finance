<script>
	import {
		generateSlug,
		cleanNumber,
		payTypes,
		categoryTypes,
		cleanObject,
		updateUserTotal
	} from '$lib/utils/functions.js';
	import { logAccountHistory, getChangedFields } from '$lib/utils/functions.js';
	import { expenseStore } from '$lib/stores/expenseStore.svelte.js';
	import { EXPENSESLUG } from '$lib/stores/expenseSlug.svelte.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormLayout from '$lib/components/FormLayout.svelte';
	import PartThree from '$lib/components/PartThree.svelte';
	import { expenseSchema } from '$lib/utils/schemas.js';
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
	const now = new Date();
	const month = now.getMonth() + 1;
	const year = now.getFullYear();

	let indexes = $state({ pay: 0, category: 0 });
	let record = $state({ id: null, update: false });
	let formState = $state({
		payDropDown: payTypes[0].value,
		categoryDropDown: categoryTypes[0].value
	});

	const resetState = () => {
		formState.payDropDown = payTypes[0].value;
		formState.categoryDropDown = categoryTypes[0].value;
		indexes.pay = 0;
		indexes.category = 0;
		record.id = null;
		record.update = false;
		checked = true;
		noValue = true;
	};

	const createExpenseHistory = async (record, amount) => {
		const history = await pb.collection('expense_history').create({
			expense: record.id,
			owner: pb.authStore.record?.id,
			amount,
			month,
			year
		});
		await pb.collection('expenses').update(record.id, {
			current_history: history.id,
			current_amount: amount
		});
	};

	const updateExpenseHistory = async (record, amount) => {
		const current = record?.expand?.current_history;
		if (current && current.month === month && current.year === year) {
			await pb.collection('expense_history').update(current.id, { amount });
		} else {
			await createExpenseHistory(record, amount);
		}
	};

	const buildPayload = (values) =>
		cleanObject({
			...values,
			user: pb.authStore.record?.id,
			owner: pb.authStore.record?.name,
			slug: generateSlug(values.title),
			amount_frequency: formState.payDropDown,
			category: formState.categoryDropDown,
			current_amount: values.amount,
			status: checked
		});

	const saveRecord = async (values) => {
		const payload = buildPayload(values);

		if (record.update) {
			const oldRecord = await pb
				.collection('expenses')
				.getOne(record.id, { expand: 'current_history' });
			await pb.collection('expenses').update(record.id, payload);
			const changes = getChangedFields(oldRecord, payload);
			if (Object.keys(changes).length > 0) {
				await logAccountHistory({
					type: 'expense_update',
					title: `Updated expense "${payload.title}"`,
					meta: changes
				});
			}
			const updated = await pb
				.collection('expenses')
				.getOne(record.id, { expand: 'current_history' });
			await updateExpenseHistory(updated, payload.current_amount);
			const total = await updateUserTotal(pb.authStore.record.id);
			if (typeof total === 'number') expenseStore.setUserTotal(total);
			await goto(resolve(`${page.url.pathname}#${payload.slug}`));
			EXPENSESLUG.value = `#${payload.slug}`;
			toast.success('Successfully updated');
		} else {
			const newRecord = await pb.collection('expenses').create(payload);
			await logAccountHistory({
				type: 'expense_create',
				title: `Created expense "${payload.title}"`,
				meta: {
					id: newRecord.id,
					amount: payload.current_amount
				}
			});
			await createExpenseHistory(newRecord, payload.current_amount);
			const total = await updateUserTotal(pb.authStore.record.id);
			if (typeof total === 'number') expenseStore.setUserTotal(total);
			await goto(resolve(`${page.url.pathname}#${payload.slug}`));
			toast.success('Successfully created');
		}
	};

	const { form, reset, isSubmitting, setFields } = createForm({
		initialValues: { title: '', amount: '' },
		extend: [validator({ schema: expenseSchema }), reporterDom()],
		transform: (values) => ({ ...values, amount: Number(cleanNumber(values.amount)) || '' }),
		onSubmit: async (values) => {
			try {
				values.amount = toMonthly(values.amount, formState.payDropDown);
				await saveRecord(values);
				open = false;
				await tick();
				reset();
				resetState();
			} catch (error) {
				console.dir(error?.response, { depth: null });
				toast.error(error?.message ?? 'Could not connect to the server');
			}
		}
	});

	handleReset = () => resetState();

	handleEditRecord = async (data) => {
		open = true;
		checked = data?.status;
		indexes.pay = payTypes.findIndex((item) => item.value === data?.amount_frequency);
		indexes.category = categoryTypes.findIndex((item) => item.value === data?.category);
		await tick();
		record.update = true;
		record.id = data?.id;
		setFields({
			title: data?.title || '',
			amount: fromMonthly(data?.current_amount, data?.amount_frequency) || ''
		});
		formState.payDropDown = payTypes[indexes.pay]?.value ?? payTypes[0].value;
		formState.categoryDropDown = categoryTypes[indexes.category]?.value ?? categoryTypes[0].value;
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

<FormLayout isMultiStepForm={false}>
	<form class="space-y-6.5" use:form>
		<PartThree
			pay={indexes.pay}
			category={indexes.category}
			bind:payDropDown={formState.payDropDown}
			bind:categoryDropDown={formState.categoryDropDown}
			bind:checked
		/>
		<Dialog.Footer>
			<Dialog.Close
				type="button"
				class="h-13 flex-1 cursor-pointer rounded-lg border border-grey-300 bg-transparent px-6 font-medium md:hover:bg-grey-900 md:dark:hover:bg-gray-200"
			>
				Cancel
			</Dialog.Close>
			<FormButton disableButton={$isSubmitting} text="Submit" class="flex-1" />
		</Dialog.Footer>
	</form>
</FormLayout>
