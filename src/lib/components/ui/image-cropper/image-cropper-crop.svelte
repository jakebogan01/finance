<script>
	import { Button } from '../button';
	import { useImageCropperCrop } from './image-cropper.svelte.js';
	import CropIcon from '@lucide/svelte/icons/crop';

	let { ref = $bindable(null), variant = 'default', size = 'sm', onclick, ...rest } = $props();

	const cropState = useImageCropperCrop();
</script>

<Button
	{...rest}
	bind:ref
	{size}
	{variant}
	onclick={(e) => {
		onclick?.(e);
		cropState.onclick();
	}}
	class="dark:md:hover-bg-yellow-100 h-13 w-1/2 bg-yellow-200 px-6! font-medium text-grey-800 md:hover:bg-yellow-100 dark:text-white-0"
>
	<CropIcon />
	<span>Crop</span>
</Button>
