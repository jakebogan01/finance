export const ssr = false;

import { authCheck } from '$lib/utils/functions.js';

export const load = async () => authCheck();
