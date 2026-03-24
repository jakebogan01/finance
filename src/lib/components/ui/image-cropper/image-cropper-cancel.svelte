<script>
	import { Button } from '../button';
	import { useImageCropperCancel } from './image-cropper.svelte.js';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';

	let { ref = $bindable(null), variant = 'default', size = 'sm', onclick, ...rest } = $props();

	const cancelState = useImageCropperCancel();
</script>

<Button
	{...rest}
	bind:ref
	{size}
	{variant}
	onclick={(e) => {
		onclick?.(e);
		cancelState.onclick();
	}}
	class="h-13 w-1/2 cursor-pointer rounded-lg border border-grey-300 bg-transparent px-6! font-medium text-white-0 md:hover:bg-grey-900 dark:border-grey-500 dark:text-grey-900 md:dark:hover:bg-gray-200"
>
	<Trash2Icon />
	<span>Cancel</span>
</Button>
