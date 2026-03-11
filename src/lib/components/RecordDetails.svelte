<script>
	import { formatDate, formatPhone, timeAgo, usdFormatter } from '$lib/utils/misc';
	import BriefcaseBusinessIcon from '@lucide/svelte/icons/briefcase-business';
	import EditDeleteDropDown from '$lib/components/EditDeleteDropDown.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import HandCoinsIcon from '@lucide/svelte/icons/hand-coins';
	import KeyRoundIcon from '@lucide/svelte/icons/key-round';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { listItem } from '$lib/snippets/ListItem.svelte';
	import HistoryIcon from '@lucide/svelte/icons/history';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import MailIcon from '@lucide/svelte/icons/mail';
	import UserIcon from '@lucide/svelte/icons/user';

	let { data, handleEditRecord } = $props();

	let details = $derived.by(() => {
		if (!data) return [];

		const items = [
			{
				label: 'Job position',
				value: data.position,
				icon: BriefcaseBusinessIcon
			},
			{
				label: 'Company email',
				value: data.company_email,
				icon: MailIcon,
				copy: true
			},
			{
				label: 'Company phone',
				value: formatPhone(data.company_phone),
				icon: PhoneIcon,
				copy: true
			},
			{
				label: 'Company manager',
				value: data.manager_name,
				icon: UserIcon
			},
			{
				label: 'Start date',
				value: formatDate(data.start_date),
				icon: CalendarIcon
			},
			{
				label: 'Last updated',
				value: timeAgo(data.updated),
				icon: HistoryIcon
			},
			{
				label: 'Compensation',
				value: usdFormatter.format(data.pay),
				icon: HandCoinsIcon
			},
			{
				label: 'User',
				value: data.status ? 'Active' : 'Inactive',
				icon: KeyRoundIcon
			}
		];

		return items.filter((item) => item.value);
	});

	let address = $derived.by(() => {
		if (!data) return null;

		const hasAddress =
			data.company_address || data.company_city || data.company_state || data.company_zip;

		if (!hasAddress) return null;

		return {
			label: 'Address',
			icon: MapPinIcon,
			value: {
				address: data.company_address,
				city: data.company_city,
				state: data.company_state,
				zip: data.company_zip
			}
		};
	});
</script>

<div class="lg:col-start-3 lg:row-end-1">
	<h3 class="sr-only">Details</h3>
	<div
		class="overflow-hidden rounded-2xl border border-grey-300 bg-grey-1000 p-4 sm:rounded-30 sm:p-5"
	>
		<dl class="flex flex-wrap items-center justify-between rounded-2xl bg-yellow-100 p-4.25">
			<div class="text-grey-600">
				<dt class="text-preset-6-medium w-50 truncate">{data?.company_name}</dt>
				<dd class="text-preset-3-medium">
					{usdFormatter.format(data?.income)}<span class="text-preset-1 text-grey-100"
						>/ {data?.recurring}</span
					>
				</dd>
			</div>
			<div class="flex-none">
				<EditDeleteDropDown {data} {handleEditRecord} />
			</div>
		</dl>
		<Separator class="my-6" />
		<dl class="flex flex-wrap overflow-hidden rounded-2xl border-t border-grey-775 bg-grey-900">
			{#each details as item (item.label)}
				{@render listItem(item, false)}
			{/each}
		</dl>
		{#if address}
			<Separator class="my-6" />
			<dl class="flex flex-wrap rounded-2xl border-t border-grey-775 bg-grey-900">
				{@render listItem(address, true)}
			</dl>
		{/if}
	</div>
</div>
