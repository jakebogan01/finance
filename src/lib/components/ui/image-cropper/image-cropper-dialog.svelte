<script>
	import * as Dialog from '../dialog';
	import { cn } from '$lib/utils.js';
	import { useImageCropperDialog } from './image-cropper.svelte.js';

	let { children, class: className, ...rest } = $props();

	const dialogState = useImageCropperDialog();
</script>

<Dialog.Root bind:open={dialogState.rootState.open}>
	<Dialog.Content
		onOpenAutoFocus={(event) => event.preventDefault()}
		{...rest}
		hideClose
		showCloseButton={false}
		class={cn('min-h-96 max-w-9/10 rounded-lg border-x-0 sm:max-w-lg sm:border-x', className)}
	>
		<div class="flex flex-col gap-4">
			{@render children?.()}
		</div>
	</Dialog.Content>
</Dialog.Root>
