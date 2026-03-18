<script>
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { inputField } from '$lib/snippets/InputField.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import { DASHBOARD } from '$lib/utils/constants.js';
	import { authSchema } from '$lib/utils/schemas.js';
	import { validator } from '@felte/validator-zod';
	import reporterDom from '@felte/reporter-dom';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';

	const { form, reset, isSubmitting } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		extend: [validator({ schema: authSchema }), reporterDom()],
		onSubmit: async (values) => {
			try {
				await pb.collection('users').authWithPassword(values.email, values.password);
				await goto(resolve(DASHBOARD));
				toast.success('Successfully signed in!');
				reset();
			} catch (error) {
				console.dir(error?.response, { depth: null });
				toast.error(error?.message ?? 'Could not connect to the server');
			}
		}
	});
</script>

<div
	class="grid flex-1 gap-10 rounded-30 border border-grey-300 bg-grey-1000 p-5 lg:grid-cols-[3fr_4fr]"
>
	<div>
		<h3 class="text-preset-5-semibold">Personal Information</h3>
		<p class="text-preset-2 mt-2 text-grey-50">
			Manage how information is displayed on your account.
		</p>
	</div>
	<div>
		<form class="space-y-5" use:form>
			{@render inputField('Update Name', 'name', 'name')}
			{@render inputField('Update Email Address', 'email', 'email', 'email', false, 'email')}
			<div class="flex justify-end">
				<FormButton {$isSubmitting}>
					{#if $isSubmitting}
						<Spinner />
						Validating...
					{:else}
						Update
					{/if}
				</FormButton>
			</div>
		</form>
	</div>
</div>
