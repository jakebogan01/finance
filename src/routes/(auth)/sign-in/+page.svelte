<script>
	import AuthForm from "$lib/components/AuthForm.svelte";
	// import { DASHBOARD } from '$lib/utils/constants.js';
	import { authCheck } from '$lib/utils/functions.js';
	import { authSchema } from '$lib/utils/schemas.js';
	import { SIGNUP } from '$lib/utils/constants.js';
	import { validator } from '@felte/validator-zod';
	import Head from '$lib/components/Head.svelte';
	import reporterDom from '@felte/reporter-dom';
	// import { goto } from '$app/navigation';
	// import { resolve } from '$app/paths';
	// import pb from '$lib/pocketbase.js';
	import { toast } from 'svelte-sonner';
	import { resolve } from "$app/paths";
	import { createForm } from 'felte';
	import { onMount } from 'svelte';

	onMount(() => authCheck());

	let props = {
		buttonText: 'Sign in',
		useStrongPassword: false
	};

	const { form, reset, isSubmitting } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		extend: [validator({ schema: authSchema }), reporterDom()],
		onSubmit: async (values) => {
			try {
				console.log(values);
				// await pb.collection('users').authWithPassword(values.email, values.password);
				// await goto(resolve(DASHBOARD));
				// toast.success('Successfully signed in!');
				// reset();
			} catch (error) {
				console.dir(error?.response, { depth: null });
				toast.error(error?.message ?? 'Could not connect to the server');
			}
		}
	});
</script>

<Head
	page_title="Finance | Sign in"
	description="Sign in to Finance to track your income, expenses, and budget in one simple dashboard. Manage your finances and collaborate with others effortlessly."
/>

<div class="space-y-2">
	<h2 class="text-preset-8-bold">Sign in</h2>
	<p class="text-grey-50">Manage your finances with confidence!</p>
</div>

<AuthForm {form} disableButton={$isSubmitting} {...props}>
	{#snippet bellowFormButton()}
		Don't have an account?
		<a href={resolve(SIGNUP)} class="md:transition-colors md:hover:text-yellow-200">
			Sign up
		</a>
	{/snippet}
</AuthForm>