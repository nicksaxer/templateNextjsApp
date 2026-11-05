import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { AppError } from './error.util';
import type { ActionError } from '@backend/types';

export function sendActionError(error: unknown): ActionError {
    unstable_rethrow(error);
    if (error instanceof AppError) {return {success: false, status: error.status, message: error.message, fieldErrors: error.fieldErrors};}
    console.error('SERVER ACTION ERROR:', error instanceof Error ? error.name : 'Unknown error');
    throw new Error('Something went wrong. Please try again.');
}

export function sendAPIError(error: unknown): Response {
    unstable_rethrow(error);
    if (error instanceof AppError) {return Response.json({message: error.message}, {status: error.status});}
    console.error('API ERROR:', error instanceof Error ? error.name : 'Unknown error');
    return Response.json({message: 'Internal server error.'}, {status: 500});
}
