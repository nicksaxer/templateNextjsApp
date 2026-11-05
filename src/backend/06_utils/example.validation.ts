import 'server-only';
import { exampleLimits, examplePlans } from '@backend/config/example.config';
import { AppError } from './error.util';
import type { ProjectDraftInput } from '@backend/types';

export function validateProjectInput(input: unknown): ProjectDraftInput {
    if (!input || typeof input !== 'object') {throw new AppError(400, 'Please check your project details.');}
    const {name, email, plan, seats, notes, updates} = input as Record<string, unknown>;
    const errors: Record<string, string> = {};
    if (typeof name !== 'string' || !name.trim() || name.trim().length > exampleLimits.maxName) {errors.name = 'Enter a name between 1 and 80 characters.';}
    if (typeof email !== 'string' || email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {errors.email = 'Enter a valid email address.';}
    if (typeof plan !== 'string' || !examplePlans.some(item => item.id === plan)) {errors.plan = 'Choose an available plan.';}
    if (typeof seats !== 'number' || !Number.isSafeInteger(seats) || seats < exampleLimits.minSeats || seats > exampleLimits.maxSeats) {errors.seats = 'Choose between 1 and 50 people.';}
    if (typeof notes !== 'string' || notes.length > exampleLimits.maxNotes) {errors.notes = 'Keep your note within 500 characters.';}
    if (typeof updates !== 'boolean') {errors.updates = 'Choose your email preference.';}
    if (Object.keys(errors).length) {throw new AppError(400, 'A few details need your attention.', errors);}
    // The explicit guards narrow each untrusted field without accepting extra client properties.
    if (typeof name !== 'string' || typeof email !== 'string' || (plan !== 'personal' && plan !== 'studio' && plan !== 'business') || typeof seats !== 'number' || typeof notes !== 'string' || typeof updates !== 'boolean') {throw new AppError(400, 'Invalid project details.');}
    return {name: name.trim(), email: email.trim().toLowerCase(), plan, seats, notes: notes.trim(), updates};
}
