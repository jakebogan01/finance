<script>
	import { Input } from '$lib/components/ui/input/index.js';
	import { resolve } from '$app/paths';
	import FormButton from '$lib/components/FormButton.svelte';
</script>

<form class="space-y-6">
	<div>
		<label for="email" class="sr-only">Email address</label>
		<Input type="email" placeholder="Email" />
	</div>

	<div>
		<FormButton class="w-full">Sign in</FormButton>
	</div>

	<p class="text-preset-2 text-center text-grey-50">
		Already have an account?
		<a href={resolve('/sign-up')} class="md:transition-colors md:hover:text-yellow-200">Sign up</a>
	</p>
</form>
