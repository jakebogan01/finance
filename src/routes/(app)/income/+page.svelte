<script>
	import OpenFormButton from '$lib/components/OpenFormButton.svelte';
	import { incomeSchema } from '$lib/utils/schemas.js';
</script>

<OpenFormButton title="Add Income" schema={incomeSchema} />
