<script>
	import CircleButton from '$lib/components/CircleButton.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import XIcon from '@lucide/svelte/icons/x';

	let dialogEl;

	const closeMobileMenu = () => {
		if (dialogEl) dialogEl.hide();
	};
</script>

<el-dialog bind:this={dialogEl}>
	<dialog id="sidebar" class="backdrop:bg-transparent xl:hidden">
		<el-dialog-backdrop
			class="fixed inset-0 bg-grey-1100/75 backdrop-blur-3px transition-opacity duration-300 ease-linear data-closed:opacity-0"
		></el-dialog-backdrop>
		<div tabindex="0" class="fixed inset-0 flex focus:outline-none">
			<el-dialog-panel
				class="group/dialog-panel relative mr-auto flex w-full max-w-2xs min-w-2xs flex-1 transform transition duration-300 ease-in-out data-closed:opacity-0"
			>
				<div
					class="fixed top-9 right-8.5 -z-10 flex w-full justify-end duration-300 ease-in-out group-data-closed/dialog-panel:opacity-0 sm:top-12.5 sm:right-12"
				>
					<CircleButton
						Icon={XIcon}
						size="6"
						command="close"
						commandfor="sidebar"
						class="xl:hidden"
					/>
				</div>

				<Sidebar mobile={true} onAction={closeMobileMenu} />
			</el-dialog-panel>
		</div>
	</dialog>
</el-dialog>
