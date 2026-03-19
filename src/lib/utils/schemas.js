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

export const nameSchema = zod.object({
	name: zod
		.string()
		.trim()
		.toLowerCase()
		.min(1, { message: 'Name is required' })
		.max(254, { message: 'Must be less than 255 characters' })
});

export const incomeSchema = zod.object({
	company_name: zod
		.string()
		.trim()
		.toLowerCase()
		.min(1, { message: '*Required' })
		.max(254, { message: 'Max length' }),
	income: zod
		.number({
			required_error: '*Required',
			invalid_type_error: '*Required'
		})
		.min(1, { message: '*Required' })
		.max(1_000_000_000, { message: 'Too large' }),
	pay: zod
		.number({
			required_error: '*Required',
			invalid_type_error: '*Required'
		})
		.min(1, { message: '*Required' })
		.max(1_000_000_000, { message: 'Too large' }),
	position: zod
		.string()
		.trim()
		.toLowerCase()
		.min(1, { message: '*Required' })
		.max(254, { message: 'Max length' }),
	company_email: zod.preprocess(
		(val) => {
			if (val === '') return undefined;
			return val;
		},
		zod
			.string()
			.trim()
			.toLowerCase()
			.max(254, { message: 'Must be less than 255 characters' })
			.email({ message: 'Please enter a valid email address' })
			.optional()
	),
	manager_name: zod.string().trim().toLowerCase().max(254, { message: 'Max length' }).optional(),
	company_address: zod.string().trim().toLowerCase().max(254, { message: 'Max length' }).optional(),
	company_city: zod.string().trim().toLowerCase().max(254, { message: 'Max length' }).optional(),
	company_zip: zod.preprocess(
		(val) => {
			if (val === '' || val === undefined) return undefined;
			return Number(val);
		},
		zod.number().max(1_000_000_000_0, { message: 'Too large' }).optional()
	)
});

export const expensesSchema = zod.object({
	title: zod
		.string()
		.trim()
		.toLowerCase()
		.min(1, { message: '*Required' })
		.max(254, { message: 'Max length' }),
	amount: zod
		.number({
			required_error: '*Required',
			invalid_type_error: '*Required'
		})
		.min(1, { message: '*Required' })
		.max(1_000_000_000, { message: 'Too large' }),
	account_email: zod.preprocess(
		(val) => {
			if (val === '') return undefined;
			return val;
		},
		zod
			.string()
			.trim()
			.toLowerCase()
			.max(254, { message: 'Must be less than 255 characters' })
			.email({ message: 'Please enter a valid email address' })
			.optional()
	)
});

export const profileSchema = zod.object({
	email: zod.preprocess(
		(val) => {
			if (val === '') return undefined;
			return val;
		},
		zod
			.string()
			.trim()
			.toLowerCase()
			.max(254, { message: 'Must be less than 255 characters' })
			.email({ message: 'Please enter a valid email address' })
			.optional()
	),
	name: zod
		.string()
		.trim()
		.toLowerCase()
		.max(254, { message: 'Must be less than 255 characters' })
		.optional()
});

export const updatePasswordSchema = zod.object({
	password: zod
		.string()
		.min(8, { message: 'Must be at least 8 characters long' })
		.max(71, { message: 'Must be less than 71 characters' })
});

export const inviteSchema = zod.object({
	invite_code: zod
		.string()
		.trim()
		.min(1, { message: 'Code is required' })
		.max(6, { message: 'Must be less than 6 characters' })
});
