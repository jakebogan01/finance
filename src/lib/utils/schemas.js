import * as z from 'zod';

const MAX_CHARACTER_LENGTH = 255;
const MAX_AMOUNT = 1_000_000_000;

/**
 * Helpers
 */
const emptyToUndefined = (val) => (val === '' ? undefined : val);

/**
 * Reusable field schemas
 */
const emailField = z
	.string()
	.trim()
	.toLowerCase()
	.max(MAX_CHARACTER_LENGTH, { message: `Must be less than ${MAX_CHARACTER_LENGTH} characters` })
	.pipe(z.string().email({ message: 'Please enter a valid email address' }));

const optionalEmailField = z.preprocess(emptyToUndefined, emailField.optional());

const passwordField = z
	.string()
	.min(8, { message: 'Must be at least 8 characters long' })
	.max(71, { message: 'Must be less than 71 characters' });

const nameField = z
	.string()
	.trim()
	.min(1, { message: 'Name is required' })
	.max(MAX_CHARACTER_LENGTH, { message: `Must be less than ${MAX_CHARACTER_LENGTH} characters` });

const optionalStringField = z.preprocess(
	emptyToUndefined,
	z
		.string()
		.trim()
		.toLowerCase()
		.max(MAX_CHARACTER_LENGTH, { message: `Must be less than ${MAX_CHARACTER_LENGTH} characters` })
		.optional()
);

/**
 * Handles both string + number inputs (form-safe)
 */
const amountField = z.coerce
	.number({
		required_error: 'Amount is required',
		invalid_type_error: 'Amount is required'
	})
	.min(1, { message: 'Amount is required' })
	.max(MAX_AMOUNT, { message: 'Amount is too large' });

const zipField = z.preprocess(
	(val) => (val === '' ? undefined : val),
	z
		.string()
		.trim()
		.regex(/^\d{5}$/, { message: 'Invalid zip format' })
		.optional()
);

/**
 * Schemas
 */
export const authSchema = z.object({
	email: emailField,
	password: passwordField
});

export const nameSchema = z.object({
	name: nameField
});

export const incomeSchema = z.object({
	name: nameField,
	amount: amountField,
	email: optionalEmailField,
	address: optionalStringField,
	city: optionalStringField,
	zip: zipField
});

export const expenseSchema = z.object({
	title: nameField,
	amount: amountField
});
