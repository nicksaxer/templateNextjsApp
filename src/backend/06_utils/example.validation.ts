import 'server-only';
import { exampleLimits, examplePlans } from '@backend/config/example.config';
import type { ProjectDraftInput } from '@backend/types';
import { AppError } from './error.util';
import { isEmail } from './validation.util';

export function validateProjectInput(input: unknown): ProjectDraftInput {
    if (!input || typeof input !== 'object') {throw new AppError(400, 'Please check your project details.');}
    const {name, email, plan, seats, notes, updates} = input as Record<string, unknown>;
    const {maxName, minSeats, maxSeats, maxNotes} = exampleLimits;
    const values = {
        name: typeof name === 'string' ? name.trim() : '',
        email: typeof email === 'string' ? email.trim().toLowerCase() : '',
        plan: examplePlans.find(item => item.id === plan)?.id,
        seats: typeof seats === 'number' ? seats : NaN,
        notes: typeof notes === 'string' ? notes.trim() : undefined,
        updates: typeof updates === 'boolean' ? updates : undefined
    };
    const errors: Record<string, string> = {};
    if (!values.name || values.name.length > maxName) {errors.name = `Enter a name between 1 and ${maxName} characters.`;}
    if (!isEmail(values.email)) {errors.email = 'Enter a valid email address.';}
    if (!values.plan) {errors.plan = 'Choose an available plan.';}
    if (!Number.isSafeInteger(values.seats) || values.seats < minSeats || values.seats > maxSeats) {errors.seats = `Choose between ${minSeats} and ${maxSeats} people.`;}
    if (values.notes === undefined || values.notes.length > maxNotes) {errors.notes = `Keep your note within ${maxNotes} characters.`;}
    if (values.updates === undefined) {errors.updates = 'Choose your email preference.';}
    // The undefined checks repeat the errors above so TypeScript can narrow the result.
    if (Object.keys(errors).length || !values.plan || values.notes === undefined || values.updates === undefined) {throw new AppError(400, 'A few details need your attention.', errors);}
    return {...values, plan: values.plan, notes: values.notes, updates: values.updates};
}
