import 'server-only';
import { AppError } from './error.util';

export function getRequiredString(formData: FormData, key: string, fieldName: string): string {
    const value = formData.get(key);
    if (typeof value !== 'string') {throw new AppError(400, `${fieldName} must be a string.`, {[key]: `${fieldName} is required.`});}
    return value;
}

export function getOptionalString(formData: FormData, key: string, fieldName: string): string {
    if (formData.get(key) === null) {return '';}
    return getRequiredString(formData, key, fieldName);
}

export function getCheckbox(formData: FormData, key: string): boolean {
    const value = formData.get(key);
    if (value === null) {return false;}
    if (value !== 'on') {throw new AppError(400, 'Invalid checkbox value.');}
    return true;
}
