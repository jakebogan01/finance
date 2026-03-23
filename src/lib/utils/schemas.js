import * as zod from 'zod';

export const authSchema = zod.object({
	email: zod
		.string()
		.trim()
		.toLowerCase()
		.max(254, { message: 'Must be less than 255 characters' })
		.email({ message: 'Please enter a valid email address' }),
	password: zod
		.string()
		.min(8, { message: 'Must be at least 8 characters long' })
		.max(71, { message: 'Must be less than 71 characters' })
});
