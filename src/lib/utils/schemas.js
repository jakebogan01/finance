import * as zod from 'zod';

export const authSchema = zod.object({
	email: zod
		.string({ required_error: 'Email address is required' })
		.trim()
		.toLowerCase()
		.min(1, { message: 'Email is required' })
		.max(254, { message: 'Email must be less than 255 characters' })
		.email({ message: 'Please enter a valid email address' }),
	password: zod
		.string({ required_error: 'Password is required' })
		.min(8, { message: 'Password must be at least 8 characters long' })
		.max(71, { message: 'Password must be less than 71 characters' })
});

export const nameSchema = zod.object({
	name: zod
		.string({ required_error: 'Name is required' })
		.trim()
		.toLowerCase()
		.min(1, { message: 'Name is required' })
		.max(254, { message: 'Name must be less than 255 characters' })
});
