<script module>
	import { CopyButton } from '$lib/components/ui/copy-button';
	import CopyIcon from '@lucide/svelte/icons/copy';
	export { listItem };
</script>

{#snippet listItem(item, isAddress = false, i)}
	<div
		class={[
			'group flex w-full items-center justify-between gap-x-2 px-4 py-[13.45px]',
			i % 2 === 1 ? 'bg-[#1b1b1b]' : ''
		]}
	>
		<dt class="flex-none">
			<span class="sr-only">{item.label}</span>
			<item.icon class="size-4" strokeWidth="1.5" />
		</dt>
		<dd class="text-preset-2 text-right text-grey-50">
			{#if isAddress}
				{item.value.address}<br />
				{item.value.city}
				{item.value.state}, {item.value.zip}
			{:else if item.copy}
				<CopyButton
					text={item.value}
					size="sm"
					variant="ghost"
					class="h-auto! px-0 whitespace-normal!"
				>
					{#snippet icon()}
						<CopyIcon
							class="size-3.5 opacity-0 md:transition-opacity md:group-hover:opacity-100"
							strokeWidth="1.5"
						/>
					{/snippet}
					{item.value}
				</CopyButton>
			{:else}
				{item.value}
			{/if}
		</dd>
	</div>
{/snippet}
