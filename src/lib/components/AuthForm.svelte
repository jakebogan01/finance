<script>
    // import { Spinner } from '$lib/components/ui/spinner/index.js';
    // import FormButton from '$lib/components/FormButton.svelte';

    let { form, disableButton, bellowFormButton, ...props } = $props();
</script>

<form class="space-y-6" use:form>

    <div class="space-y-5">
        <div>
<!--            <FormButton {disableButton} class="w-full">-->
<!--                {#if disableButton}-->
<!--                    <Spinner />-->
<!--                    Validating...-->
<!--                {:else}-->
<!--                    {props.buttonText}-->
<!--                {/if}-->
<!--            </FormButton>-->
        </div>

        <p class="text-preset-2 text-center text-grey-50">
            {@render bellowFormButton?.()}
        </p>
    </div>
</form>