import { page } from '$app/state';
import { untrack } from 'svelte';
import { createAttachmentKey } from 'svelte/attachments';
import { SvelteURL } from 'svelte/reactivity';

/** Sets the `data-active` attribute on an `<a/>` tag based on its 'active' state.
 *
 * @param node
 * @param opts
 *
 * ## Usage
 * ```svelte
 * <a href="/" use:active>Route</a>
 * ```
 */
export function active(node, opts = {}) {
	checkIsActive(node.href, { ...opts, url: page.url }).toString();

	$effect(() => {
		page.url;

		untrack(() => {
			node.setAttribute(
				'data-active',
				checkIsActive(node.href, { ...opts, url: page.url }).toString()
			);
		});
	});
}

/** Sets the `data-active` attribute on an `<a/>` tag based on its 'active' state.
 *
 * @param opts
 * @returns
 *
 * ## Usage
 * ```svelte
 * <a href="/" {...attachActive()}>Route</a>
 * ```
 */
export function attachActive(opts = {}) {
	return {
		[createAttachmentKey()]: (node) => active(node, opts)
	};
}

export const checkIsActive = (nodeHref, { activeForSubdirectories, url, isHash, isSearch }) => {
	let href = new SvelteURL(nodeHref).pathname;

	if (isHash) {
		href = new SvelteURL(nodeHref).hash;
	}

	let searchParamName = undefined;
	let searchParamValue = undefined;

	if (isSearch) {
		const tempUrl = new SvelteURL(nodeHref);

		for (const [key, value] of tempUrl.searchParams.entries()) {
			searchParamName = key;
			searchParamValue = value;
		}

		href = new SvelteURL(nodeHref).search;
	}

	const samePath = href === url.pathname;

	const isParentRoute =
		(activeForSubdirectories == undefined || activeForSubdirectories) &&
		url.pathname.startsWith(href ?? '');

	const isHashRoute =
		isHash == true && (url.hash == href || ((href == '#' || href == '#/') && url.hash == ''));

	const isSearchRoute =
		isSearch === true &&
		searchParamName !== undefined &&
		searchParamValue !== undefined &&
		(url.searchParams.get(searchParamName) ?? '/') === searchParamValue;

	return samePath || isParentRoute || isHashRoute || isSearchRoute;
};
