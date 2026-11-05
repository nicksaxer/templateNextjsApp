import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { appConfig } from '@backend/config/app.config';
import { getMailConfig } from '@backend/config/env.config';
import type { MailValues, RenderedMail, MailDelivery } from '@backend/types';
import { AppError } from '../../06_utils/error.util';

const templateRoot = path.join(process.cwd(), 'src/backend/07_mailtemplates');
const templateNames = {welcome: 'welcome.html', project: 'project.html'} as const;

export async function renderMail(values: MailValues): Promise<RenderedMail> {
    if (!Object.hasOwn(templateNames, values.type)) {throw new AppError(400, 'Unknown email template.');}
    const [base, header, footer, template] = await Promise.all([
        readFile(path.join(templateRoot, 'base.html'), 'utf8'),
        readFile(path.join(templateRoot, 'components/header.html'), 'utf8'),
        readFile(path.join(templateRoot, 'components/footer.html'), 'utf8'),
        readFile(path.join(templateRoot, 'templates', templateNames[values.type]), 'utf8')
    ]);
    const subject = values.type === 'welcome' ? `Welcome to ${appConfig.name}` : 'Your next project, ready to go';
    const content = handlebars.compile(template)({...values, appName: appConfig.name});
    const html = handlebars.compile(base)({subject, content, appName: appConfig.name}, {partials: {header, footer}});
    const text = values.type === 'welcome' ? `Welcome, ${values.name}. Your space at ${appConfig.name} is ready.` : `${values.name}: ${values.plan}, ${values.seats} people, ${values.total} per month.`;
    return {subject, html, text};
}

// Server integrations call this deliberately. No public action exposes SMTP delivery.
export async function sendMail(recipient: string, values: MailValues): Promise<void> {
    if (recipient.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(recipient)) {throw new AppError(400, 'Invalid recipient.');}
    const {from, ...config} = getMailConfig();
    const mail = await renderMail(values);
    await nodemailer.createTransport(config).sendMail({from, to: recipient, ...mail});
}

export async function trySendEmail(recipient: string, values: MailValues): Promise<MailDelivery> {
    try {
        await sendMail(recipient, values);
        return {success: true};
    }
    catch {
        console.error('MAIL DELIVERY FAILED');
        return {success: false, message: 'The notification could not be delivered.'};
    }
}
