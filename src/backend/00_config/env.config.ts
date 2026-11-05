import 'server-only';
import { AppError } from '../06_utils/error.util';

export function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value?.trim()) {throw new AppError(503, 'This integration has not been configured.');}
    return value;
}

export function getMailConfig() {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = process.env.SMTP_SECURE ?? 'false';
    if (!Number.isInteger(port) || port < 1 || port > 65535 || !['true', 'false'].includes(secure)) {throw new AppError(503, 'Mail configuration is invalid.');}
    return {
        host: requiredEnv('SMTP_HOST'), port, secure: secure === 'true',
        auth: {user: requiredEnv('SMTP_USER'), pass: requiredEnv('SMTP_PASSWORD')},
        from: requiredEnv('SMTP_FROM')
    };
}
