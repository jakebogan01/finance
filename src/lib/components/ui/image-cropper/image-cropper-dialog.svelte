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
		class={cn('min-h-96 max-w-9/10 rounded-lg border-x-0 sm:max-w-lg sm:border-x', className)}
	>
		<div class="relative z-50 flex flex-col gap-4 bg-grey-1000 dark:bg-white-0">
			{@render children?.()}
		</div>
	</Dialog.Content>
</Dialog.Root>
