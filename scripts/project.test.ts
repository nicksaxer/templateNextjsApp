import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectDraft } from '../src/backend/03_services/example/project.service';
import { validateProjectInput } from '../src/backend/06_utils/example.validation';
import { getRequiredString, getCheckbox } from '../src/backend/06_utils/action-input.utils';
import { AppError } from '../src/backend/06_utils/error.util';

const valid = {name: '  Sunday Studio  ', email: 'Alex@Example.com', plan: 'studio', seats: 3, notes: 'A small idea.', updates: true};

test('a project draft normalizes input, uses server prices, and returns a serializable DTO without a database', async () => {
    const result = await createProjectDraft({...valid, monthlyTotal: 0, id: 'client-chosen'});
    assert.equal(result.name, 'Sunday Studio');
    assert.equal(result.email, 'alex@example.com');
    assert.equal(result.monthlyTotal, 57);
    assert.notEqual(result.id, 'client-chosen');
    assert.match(result.id, /^[a-f\d]{24}$/);
    assert.doesNotThrow(() => JSON.parse(JSON.stringify(result)));
    assert.equal(typeof result.createdAt, 'string');
});

test('forged plans, unsafe quantities, wrong types, and excessive input are rejected', () => {
    for (const seats of [0, 51, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER, '3', null]) {
        assert.throws(() => validateProjectInput({...valid, seats}), (error: unknown) => error instanceof AppError && Boolean(error.fieldErrors?.seats));
    }
    for (const patch of [{plan: 'free'}, {name: ' '}, {name: 'x'.repeat(81)}, {email: 'bad@'}, {email: 'a@b.com\r\nBcc: other@example.com'}, {notes: 'x'.repeat(501)}, {updates: 'true'}]) {
        assert.throws(() => validateProjectInput({...valid, ...patch}), AppError);
    }
    for (const input of [null, false, 'project', [], {}]) {assert.throws(() => validateProjectInput(input), AppError);}
});

test('FormData parsing rejects files where strings are required and handles checkbox semantics', () => {
    const form = new FormData();
    assert.equal(getCheckbox(form, 'updates'), false);
    form.set('updates', 'on');
    assert.equal(getCheckbox(form, 'updates'), true);
    form.set('updates', 'true');
    assert.throws(() => getCheckbox(form, 'updates'), AppError);
    assert.throws(() => getRequiredString(form, 'name', 'Name'), AppError);
    form.set('name', new File(['test'], 'test.txt'));
    assert.throws(() => getRequiredString(form, 'name', 'Name'), AppError);
    form.set('name', 'A new project');
    assert.equal(getRequiredString(form, 'name', 'Name'), 'A new project');
});
