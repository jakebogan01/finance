<script>
	import { generateSlug, cleanNumber, payTypes, cleanObject } from '$lib/utils/functions.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormLayout from '$lib/components/FormLayout.svelte';
	import PartOne from '$lib/components/PartOne.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import PartTwo from '$lib/components/PartTwo.svelte';

	let { open = $bindable() } = $props();
	let indexes = $state({
		pay: 0
	});

	let formState = $state({
		step: 1,
		phoneValue: null,
		payDropDown: payTypes[0].value
	});

	const resetState = () => {
		formState.step = 1;
		formState.phoneValue = null;
		formState.payDropDown = payTypes[0].value;
		indexes.pay = 0;
	};

	const buildPayload = (values) => {
		values.user = pb.authStore.record?.id;
		values.slug = generateSlug(values.name);
		values.pay_frequency = formState.payDropDown;
		values.phone = formState.phoneValue;
		return cleanObject(values);
	};

	const saveRecord = async (values) => {
		const payload = buildPayload(values);
		console.log(payload);
		// await pb.collection('incomes').create(payload);
	};

	const { form, reset, isSubmitting, validate } = createForm({
		initialValues: {
			name: '',
			amount: ''
		},
		extend: [validator({ schema: incomeSchema }), reporterDom()],
		transform: (values) => ({
			...values,
			amount: cleanNumber(values.amount)
		}),
		onSubmit: async (values) => {
			try {
				let amount = values.amount;
				if (amount) {
					if (formState.payDropDown === 'per week') {
						amount *= 4;
					} else if (formState.payDropDown === 'bi weekly') {
						amount *= 2;
					}
				}
				values.amount = amount;
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
		const allEmpty = keys.every((key) => result[key] === null || result[key]?.length === 0);
		if (allEmpty) formState.step += 1;
	};

	const back = () => (formState.step -= 1);
</script>

<FormLayout step={formState.step}>
	<form class="space-y-6.5" use:form>
		<PartOne pay={indexes.pay} step={formState.step} bind:payDropDown={formState.payDropDown} />
		<PartTwo
			pay={indexes.pay}
			step={formState.step}
			bind:payDropDown={formState.payDropDown}
			bind:phoneValue={formState.phoneValue}
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
