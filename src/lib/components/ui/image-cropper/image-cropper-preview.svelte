<script>
	import * as Avatar from '../avatar';
	import SquarePenIcon from '@lucide/svelte/icons/square-pen';
	import { useImageCropperPreview } from './image-cropper.svelte.js';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import { cn } from '$lib/utils.js';

	let { child, class: className } = $props();

	const previewState = useImageCropperPreview();
</script>

{#if child}
	{@render child({ src: previewState.rootState.src })}
{:else}
	<Avatar.Root
		class={cn(
			'group size-12.5 cursor-pointer overflow-hidden ring-1 ring-grey-300 sm:size-17',
			className
		)}
	>
		<div
			class="absolute inset-0 flex items-center justify-center bg-grey-1100/70 text-gray-300 opacity-0 md:transition-opacity md:group-hover:opacity-100 dark:text-black"
		>
			<SquarePenIcon class="size-4" />
		</div>
		<Avatar.Image src={previewState.rootState.src} />
		<Avatar.Fallback>
			<UploadIcon class="size-4" />
			<span class="sr-only">Upload image</span>
		</Avatar.Fallback>
	</Avatar.Root>
{/if}
