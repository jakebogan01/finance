<script module>
	import { CopyButton } from '$lib/components/ui/copy-button';
	import CopyIcon from '@lucide/svelte/icons/copy';
	export { listItem };
</script>

{#snippet listItem(item, isAddress = false)}
	<div
		class={[
			'flex w-full items-center justify-between gap-x-2 px-4 py-[13.45px] even:bg-[#1b1b1b] dark:even:bg-gray-300'
		]}
	>
		<dt class="flex-none">
			<span class="sr-only">{item.label}</span>
			<item.icon class="size-4" strokeWidth="1.5" />
		</dt>
		<dd class="text-preset-2 text-right text-grey-50">
			{#if isAddress}
				{item.value.address}
				{#if item.value.address?.length > 0 && (item.value.city?.length > 0 || item.value.state || item.value.zip)}
					<br />
				{/if}
				{item.value.city}{#if item.value.city?.length > 0 && item.value.state},{/if}
				{item.value.state}
				{item.value.zip}
			{:else if item.copy}
				<CopyButton
					text={item.value}
					size="sm"
					variant="ghost"
					class="h-auto! px-0 whitespace-normal!"
				>
					{#snippet icon()}
						<CopyIcon class="size-3.5" strokeWidth="1.5" />
					{/snippet}
					{item.value}
				</CopyButton>
			{:else}
				{item.value}
			{/if}
		</dd>
	</div>
{/snippet}
