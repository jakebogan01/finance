<script>
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { createForm } from 'felte';

	let open = $state(false);
	let step = $state(1);

	const { form, reset, isSubmitting, validate } = createForm({
		initialValues: {
			company_name: '',
			income: ''
		},
		extend: [validator({ schema: incomeSchema }), reporterDom()],
		transform: (values) => {
			const cleaned = String(values.income).replace(/\D/g, '');

			return {
				...values,
				income: cleaned ? Number(cleaned) : null
			};
		},
		onSubmit: async (values) => {
			try {
				console.log(values);
				reset();
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
			<Dialog.Header>
				<Dialog.Title class="text-preset-5-semibold text-grey-50">Add income</Dialog.Title>
			</Dialog.Header>

			<div class="flex gap-2">
				{#each [1, 2] as s, i (i)}
					<div
						class="h-2 flex-1 rounded"
						class:bg-red-500={step >= s}
						class:bg-blue-500={step < s}
					></div>
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
