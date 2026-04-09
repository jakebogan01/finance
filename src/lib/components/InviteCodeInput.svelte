<script>
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import FormButton from '$lib/components/FormButton.svelte';
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Dialog from '$lib/components/ui/dialog';

	let { open = $bindable() } = $props();
</script>

<Dialog.Content showCloseButton={false} class="p-5">
	<form>
		<Dialog.Header class="text-center">
			<Dialog.Title class="text-preset-5-semibold">Enter Account Code</Dialog.Title>
		</Dialog.Header>
		<Field.Group>
			<Field.Field class="mb-12">
				<Field.Label for="invite_code" class="sr-only">Account Code</Field.Label>
				<InputOTP.Root
					maxlength={6}
					id="invite_code"
					class="mt-10 mb-3 items-center justify-center"
					required
				>
					{#snippet children({ cells })}
						<InputOTP.Group
							class="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border"
						>
							{#each cells as cell (cell)}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<Field.Description class="text-center">Enter the 6-digit code to invite.</Field.Description>
			</Field.Field>
		</Field.Group>
		<Dialog.Footer>
			<Dialog.Close
				type="button"
				class="h-13 flex-1 cursor-pointer rounded-lg border border-grey-300 bg-transparent px-6 font-medium md:hover:bg-grey-900 md:dark:hover:bg-gray-200"
			>
				Cancel
			</Dialog.Close>
			<FormButton disableButton={false} text="Send" class="flex-1" />
		</Dialog.Footer>
	</form>
</Dialog.Content>
