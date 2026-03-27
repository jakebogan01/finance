<script>
	import { generateSlug, cleanNumber, payTypes, cleanObject } from '$lib/utils/functions.js';
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

	let { open = $bindable() } = $props();
	let indexes = $state({
		pay: 0
	});

	let formState = $state({
		step: 1,
		payDropDown: payTypes[0].value
	});

	const resetState = () => {
		formState.step = 1;
		formState.payDropDown = payTypes[0].value;
		indexes.pay = 0;
	};

	const buildPayload = (values) => {
		values.user = pb.authStore.record?.id;
		values.slug = generateSlug(values.name);
		values.pay_frequency = formState.payDropDown;
		return cleanObject(values);
	};

	const saveRecord = async (values) => {
		const payload = buildPayload(values);
		await pb.collection('incomes').create(payload);
	};

	const { form, reset, isSubmitting } = createForm({
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
</script>

<FormLayout step={formState.step}>
	<form class="space-y-6.5" use:form>
		<PartOne pay={indexes.pay} step={formState.step} bind:payDropDown={formState.payDropDown} />
		<Dialog.Footer>
			<FormButton disableButton={$isSubmitting} text="Submit" class="w-full" />
		</Dialog.Footer>
	</form>
</FormLayout>
