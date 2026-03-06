<script>
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { DASHBOARD } from '$lib/utils/constants.js';
	import { authSchema } from '$lib/utils/schemas.js';
	import { validator } from '@felte/validator-zod';
	import { SIGNUP } from '$lib/utils/constants.js';
	import reporterDom from '@felte/reporter-dom';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import pb from '$lib/pocketbase.js';
	import { createForm } from 'felte';
	import { resolve } from '$app/paths';

	let props = {
		linkText: 'Sign up',
		link: SIGNUP,
		preLinkText: "Don't have an account?",
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
				await pb.collection('users').authWithPassword(values.email, values.password);
				await goto(resolve(DASHBOARD));
				toast.success('Successfully signed in!');
				reset();
			} catch (error) {
				console.dir(error?.response, { depth: null });
			}
		}
	});
</script>

<AuthForm {form} disableButton={$isSubmitting} {...props} />
