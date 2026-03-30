<script>
	import { formatDate, formatPhone, timeAgo, usdFormatter } from '$lib/utils/functions.js';
	// import EditDeleteDropDown from '$lib/components/EditDeleteDropDown.svelte';
	import RecordDetailsItem from '$lib/components/RecordDetailsItem.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	// import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	// import HandCoinsIcon from '@lucide/svelte/icons/hand-coins';
	import KeyRoundIcon from '@lucide/svelte/icons/key-round';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import HistoryIcon from '@lucide/svelte/icons/history';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import MailIcon from '@lucide/svelte/icons/mail';
	// import UserIcon from '@lucide/svelte/icons/user';

	let { data } = $props();

	let details = $derived.by(() => {
		if (!data) return [];

		const items = [
			{
				label: 'Company email',
				value: data.email,
				icon: MailIcon,
				copy: true
			},
			{
				label: 'Company phone',
				value: formatPhone(data.phone),
				icon: PhoneIcon,
				copy: true
			},
			{
				label: 'Start date',
				value: formatDate(data.date),
				icon: CalendarIcon,
				copy: false
			},
			{
				label: 'Last updated',
				value: timeAgo(data.updated),
				icon: HistoryIcon,
				copy: false
			},
			// {
			//     label: 'Category',
			//     value: data.category,
			//     icon: CreditCardIcon,
			//     copy: false
			// },
			// {
			//     label: 'Compensation',
			//     value: usdFormatter.format(data.pay || data.expand.current_history.amount),
			//     icon: HandCoinsIcon
			// },
			{
				label: 'User',
				value: 'JB',
				icon: KeyRoundIcon,
				copy: false
			}
		];
		return items.filter((item) => item.value);
	});

	let address = $derived.by(() => {
		if (!data) return null;
		const hasAddress = data.address || data.city || data.state || data.zip;
		if (!hasAddress) return null;

		return {
			label: 'Address',
			icon: MapPinIcon,
			value: {
				address: data.address,
				city: data.city,
				state: data.state,
				zip: data.zip
			},
			copy: false
		};
	});
</script>

<div id={data?.slug} class="lg:col-start-3 lg:row-end-1">
	<h3 class="sr-only">Details</h3>
	<div class="overflow-hidden sm:rounded-20">
		<dl class="flex flex-wrap items-center justify-between rounded-2xl bg-yellow-100 px-4 py-6">
			<div class="text-grey-600 dark:text-white-0">
				<dt class="text-preset-6 w-58 truncate font-semibold sm:w-100 lg:w-76 xl:w-71">
					{data?.name || data?.title}
				</dt>
				<dd class="text-preset-3-medium">
					{usdFormatter.format(data?.amount || data?.expand?.current_history?.amount)}
					<span class="text-preset-1 text-grey-100 dark:text-white">/per month</span>
				</dd>
			</div>
			<div class="flex-none">
				<!--                <EditDeleteDropDown {data} {handleEditRecord} {collectionName} />-->
			</div>
		</dl>
		<Separator class="my-5" />
		<dl
			class="flex flex-wrap overflow-hidden rounded-2xl border-t border-grey-500 bg-grey-900 dark:border-gray-300 dark:bg-gray-100"
		>
			{#each details as item (item.label)}
				<RecordDetailsItem {item} />
			{/each}
		</dl>
		{#if address}
			<Separator class="my-5" />
			<dl
				class="flex flex-wrap overflow-hidden rounded-2xl border-t border-grey-500 bg-grey-900 dark:border-gray-300 dark:bg-gray-100"
			>
				<RecordDetailsItem item={address} isAddress={true} />
			</dl>
		{/if}
	</div>
</div>
