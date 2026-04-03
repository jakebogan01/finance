<script>
	import PaginationButton from '$lib/components/PaginationButton.svelte';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { toast } from 'svelte-sonner';

	let { store } = $props();

	const currentPage = $derived(store.paginated?.page ?? 1);
	const totalPages = $derived(Math.max(1, store.paginated?.totalPages ?? 1));
	const prevPage = $derived(Math.max(1, currentPage - 1));
	const nextPage = $derived(Math.min(totalPages, currentPage + 1));
	const isPrevDisabled = $derived(currentPage === 1);
	const isNextDisabled = $derived(currentPage === totalPages);

	let loading = $state(false);

	const handlePagination = async (pageNumber) => {
		if (loading) return;
		loading = true;
		try {
			await store.setPage(pageNumber);
		} catch (error) {
			console.dir(error?.response, { depth: null });
			toast.error(error?.message ?? 'Could not connect to the server');
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex items-center justify-between pt-8">
	<PaginationButton
		isDisabled={isPrevDisabled}
		{loading}
		handlePagination={() => handlePagination(prevPage)}
	>
		<ChevronLeftIcon class="size-8" />
	</PaginationButton>
	<span class="text-xs text-grey-100 dark:text-grey-500">
		Page {currentPage} of {totalPages}
	</span>
	<PaginationButton
		isDisabled={isNextDisabled}
		{loading}
		handlePagination={() => handlePagination(nextPage)}
	>
		<ChevronRightIcon class="size-8" />
	</PaginationButton>
</div>
