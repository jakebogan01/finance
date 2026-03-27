import * as zod from 'zod';

const MAX_CHARACTER_LENGTH = 255;

export const authSchema = zod.object({
	email: zod
		.string()
		.trim()
		.toLowerCase()
		.max(MAX_CHARACTER_LENGTH, { message: 'Must be less than 255 characters' })
		.email({ message: 'Please enter a valid email address' }),
	password: zod
		.string()
		.min(8, { message: 'Must be at least 8 characters long' })
		.max(71, { message: 'Must be less than 71 characters' })
});

export const nameSchema = zod.object({
	name: zod
		.string()
		.trim()
		.nonempty({ message: 'Name is required' })
		.max(MAX_CHARACTER_LENGTH, { message: 'Must be less than 255 characters' })
});

export const incomeSchema = zod.object({
	name: zod
		.string()
		.trim()
		.nonempty({ message: 'Name is required' })
		.max(255, { message: 'Must be less than 255 characters' }),
	amount: zod
		.number({
			required_error: 'Amount is required',
			invalid_type_error: 'Amount is required'
		})
		.min(1, { message: 'Amount is required' })
		.max(1_000_000_000, { message: 'Amount is too large' })
});
