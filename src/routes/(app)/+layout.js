export const ssr = false;

import { SIGNIN } from '$lib/utils/constants';
import { authCheck } from '$lib/utils/functions.js';

export const load = async () => authCheck(303, SIGNIN, true);
