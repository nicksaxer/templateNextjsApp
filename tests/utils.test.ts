import test from 'node:test';
import assert from 'node:assert/strict';
import delay from '../src/frontend/utils/delay';
import { formatDate } from '../src/frontend/utils/format';

test('delay supports cancellation before and during a pending operation', async () => {
    const controller = new AbortController();
    const pending = delay(60_000, controller.signal);
    controller.abort(new Error('Cancelled'));
    await assert.rejects(pending, /Cancelled/);
    await assert.rejects(delay(60_000, controller.signal), /Cancelled/);
});

test('date formatting is deterministic across server and browser timezones', () => {
    assert.equal(formatDate('2026-11-05T23:59:59Z'), formatDate('2026-11-05T00:00:00Z'));
});
