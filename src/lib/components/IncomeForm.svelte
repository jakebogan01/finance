<script>
	import { generateSlug, cleanNumber, payTypes } from '$lib/utils/functions.js';
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

	let indexes = $state({
		pay: 0,
		state: 0,
		category: 0
	});

	let formState = $state({
		step: 1,
		payDropDown: payTypes[0].value
	});

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
				values.slug = generateSlug(values.name);
				await pb.collection('incomes').create(values);
				reset();
			} catch (error) {
				console.dir(error?.response, { depth: null });
				toast.error(error?.message ?? 'Could not connect to the server');
			}
		}
	});
</script>

<FormLayout step={formState.step}>
	<form class="space-y-6.5" use:form>
		<PartOne pay={indexes.pay} {...formState} />
		<Dialog.Footer>
			<FormButton disableButton={$isSubmitting} text="Submit" class="w-full" />
		</Dialog.Footer>
	</form>
</FormLayout>
