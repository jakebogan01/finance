<script>
	import { Separator } from '$lib/components/ui/separator/index.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import FormField from '$lib/components/FormField.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { authSchema } from '$lib/utils/schemas.js';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import { generateSlug } from '$lib/utils/functions.js';

	let formState = $state({
		step: 1
	});

	const { form, reset, isSubmitting } = createForm({
		initialValues: {
			name: '',
			amount: ''
		},
		// extend: [validator({ schema: authSchema }), reporterDom()],
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

<Dialog.Content showCloseButton={false}>
	<Dialog.Header class="text-center">
		<Dialog.Title class="text-preset-5-semibold">Add Income</Dialog.Title>
		<Dialog.Description>This can be either a bill or a subscription</Dialog.Description>
	</Dialog.Header>
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
				/>
			</FormField>
		</div>
		<Dialog.Footer>
			<FormButton disableButton={$isSubmitting} text="Submit" class="w-full" />
		</Dialog.Footer>
	</form>
</Dialog.Content>
