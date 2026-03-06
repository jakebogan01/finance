export const ssr = false;

import { authCheck } from '$lib/utils/misc';

export const load = async () => authCheck();
