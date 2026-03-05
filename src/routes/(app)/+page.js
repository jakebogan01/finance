export const ssr = false;

import { DASHBOARD } from '$lib/utils/constants';
import { redirect } from '@sveltejs/kit';

export const load = async () => redirect(308, DASHBOARD);
