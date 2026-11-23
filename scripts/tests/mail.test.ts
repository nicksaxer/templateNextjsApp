import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMail } from '@backend/services/system/mail.service';
import { getShowcase } from '@backend/queries/example/showcase.query';
import { AppError } from '@backend/utils';
import { getMailConfig, requiredEnv } from '@backend/config/env.config';

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

test('the gallery receives rendered welcome and project email previews', async () => {
    const {mails} = await getShowcase();
    assert.equal(mails.length, 2);
    assert.match(mails[0].html, /Welcome, <span[^>]*>Alex<\/span>!/);
    assert.match(mails[1].html, /<h1[^>]*>Sunday Studio<\/h1>/);
    assert.match(mails[1].html, /CHF 57\.00/);
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
