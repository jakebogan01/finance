<script>
	import {
		generateSlug,
		onlyNumbers,
		unformatCurrency,
		formatCurrency,
		cleanNumber
	} from '$lib/utils/functions.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormLayout from '$lib/components/FormLayout.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/FormField.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';

	let formState = $state({
		step: 1
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
		<div class:hidden={formState.step !== 1} class="grid grid-cols-6 gap-6.5">
			<FormField id="name" name="name" label="Name" class="col-span-full">
				<Input type="text" id="name" name="name" placeholder="Name" maxLength="255" minLength="1" />
			</FormField>
			<FormField id="amount" name="amount" label="Amount" class="col-span-3">
				<Input
					type="text"
					id="amount"
					name="amount"
					placeholder="Amount"
					maxLength="255"
					minLength="1"
					inputmode="numeric"
					pattern="[0-9]*"
					oninput={onlyNumbers}
					onfocus={unformatCurrency}
					onblur={formatCurrency}
				/>
			</FormField>
		</div>
		<Dialog.Footer>
			<FormButton disableButton={$isSubmitting} text="Submit" class="w-full" />
		</Dialog.Footer>
	</form>
</FormLayout>
