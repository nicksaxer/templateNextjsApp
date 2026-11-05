import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMail } from '../src/backend/03_services/system/mail.service';
import { AppError } from '../src/backend/06_utils/error.util';
import { getMailConfig, requiredEnv } from '../src/backend/00_config/env.config';

test('mail rendering includes layout and partials and escapes all substituted user content', async () => {
    const mail = await renderMail({type: 'welcome', name: '<img src=x onerror=alert(1)>'});
    assert.match(mail.html, /<!doctype html>/);
    assert.match(mail.html, /Example email/);
    assert.match(mail.html, /&lt;img/);
    assert.doesNotMatch(mail.html, /<img/);
    assert.doesNotMatch(mail.html, /{{/);
    assert.match(mail.text, /<img/);
    assert.equal(mail.subject, 'Welcome to Component library');
});

test('unknown template names cannot traverse the filesystem', async () => {
    // Runtime callers can still violate TypeScript's contract.
    const payload = JSON.parse('{"type":"../../../../etc/passwd","name":"Alex"}');
    await assert.rejects(renderMail(payload), AppError);
});

test('configuration is lazy and missing integrations fail clearly', () => {
    assert.throws(() => requiredEnv('TEST_MISSING_SETTING'), AppError);
    process.env.TEST_CONFIG_SECRET = ' a secret with spaces ';
    try {assert.equal(requiredEnv('TEST_CONFIG_SECRET'), ' a secret with spaces ');}
    finally {delete process.env.TEST_CONFIG_SECRET;}
    const previous = process.env.SMTP_PORT;
    try {
        process.env.SMTP_PORT = 'invalid';
        assert.throws(getMailConfig, AppError);
    }
    finally {
        if (previous === undefined) {delete process.env.SMTP_PORT;}
        else {process.env.SMTP_PORT = previous;}
    }
});
