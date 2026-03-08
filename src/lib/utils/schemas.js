import * as zod from 'zod';

export const authSchema = zod.object({
	email: zod
		.string()
		.trim()
		.toLowerCase()
		.max(254, { message: 'Email must be less than 255 characters' })
		.email({ message: 'Please enter a valid email address' }),
	password: zod
		.string()
		.min(8, { message: 'Password must be at least 8 characters long' })
		.max(71, { message: 'Password must be less than 71 characters' })
});

export const nameSchema = zod.object({
	name: zod
		.string()
		.trim()
		.toLowerCase()
		.min(1, { message: 'Name is required' })
		.max(254, { message: 'Name must be less than 255 characters' })
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
	company_email: zod.preprocess(
		(val) => {
			if (val === '') return undefined;
			return val;
		},
		zod
			.string()
			.trim()
			.toLowerCase()
			.max(254, { message: 'Email must be less than 255 characters' })
			.email({ message: 'Please enter a valid email address' })
			.optional()
	),
	pay: zod.preprocess(
		(val) => {
			if (val === '' || val === undefined) return undefined;
			return Number(val);
		},
		zod.number().max(1_000_000_000, { message: 'Too large' }).optional()
	),
	position: zod.string().trim().toLowerCase().max(254, { message: 'Max length' }).optional(),
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
