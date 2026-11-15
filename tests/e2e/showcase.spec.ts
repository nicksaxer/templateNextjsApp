import { test as base, expect } from '@playwright/test';

const test = base.extend({
    page: async ({page}, runPage) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await runPage(page);
        expect(errors, 'Client-side errors').toEqual([]);
    }
});

test('source controls support typing, steppers, native selection, and reset', async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Component library', exact: true})).toBeVisible();
    await page.getByLabel('Text', {exact: true}).fill('Example');
    await page.getByRole('button', {name: 'Show password'}).click();
    await expect(page.getByLabel('Password', {exact: true})).toHaveAttribute('type', 'text');
    await page.getByRole('button', {name: 'Increase Quantity'}).click();
    await expect(page.getByRole('spinbutton', {name: 'Quantity', exact: true})).toHaveValue('4');
    const selection = page.getByLabel('Select an option', {exact: true});
    await expect(selection).toHaveJSProperty('tagName', 'SELECT');
    await selection.selectOption('third');
    await expect(page.getByText('Selected: third')).toBeVisible();
    const required = page.getByLabel('Required select', {exact: true});
    await expect(required).toHaveJSProperty('willValidate', true);
    expect(await required.evaluate((node: HTMLSelectElement) => node.validity.valueMissing)).toBe(true);
    await required.selectOption('available');
    expect(await required.evaluate((node: HTMLSelectElement) => new FormData(node.form!).get(node.name))).toBe('available');
    await expect(page.getByLabel('Disabled select', {exact: true})).toBeDisabled();
    const switchInput = page.getByRole('switch', {name: 'Example switch'});
    await switchInput.focus();
    await page.keyboard.press('Space');
    await expect(switchInput).not.toBeChecked();
    await page.getByRole('button', {name: 'Reset inputs'}).click();
    await expect(page.getByLabel('Text', {exact: true})).toHaveValue('');
    await expect(page.getByRole('spinbutton', {name: 'Quantity', exact: true})).toHaveValue('3');
    await expect(page.getByText('Selected: second')).toBeVisible();
    await expect(selection).toHaveValue('second');
    await expect(required).toHaveValue('');
    await expect(switchInput).toBeChecked();
    await selection.focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Selected: first')).toBeVisible();
});

test('theme preferences survive reloads and palettes can be switched', async ({page}) => {
    const response = await page.goto('/');
    const documentTag = (await response?.text())?.match(/<html\b[^>]*>/)?.[0];
    expect(documentTag).toContain('data-theme="dark"');
    expect(documentTag).toContain('data-palette="guildmarket"');

    const root = page.locator('html');
    const darkMode = page.getByRole('switch', {name: 'Dark mode'});
    const guildMarket = page.getByRole('button', {name: 'GuildMarket', exact: true});
    const seppOS = page.getByRole('button', {name: 'SeppOS', exact: true});
    await expect(darkMode).toBeChecked();
    await expect(guildMarket).toHaveAttribute('aria-pressed', 'true');
    await darkMode.press('Space');
    await expect(root).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(root).toHaveAttribute('data-theme', 'light');
    await expect(darkMode).not.toBeChecked();
    await seppOS.click();
    await expect(seppOS).toHaveAttribute('aria-pressed', 'true');
    await expect(root).toHaveAttribute('data-palette', 'seppos');
    await guildMarket.click();
    await expect(guildMarket).toHaveAttribute('aria-pressed', 'true');
    await expect(root).toHaveAttribute('data-palette', 'guildmarket');
});

test('feedback, tooltip, empty state, and loading examples work', async ({page}) => {
    await page.goto('/#feedback');
    await page.getByRole('button', {name: 'Add item', exact: true}).click();
    await expect(page.getByText('Example item', {exact: true})).toBeVisible();
    const icon = page.getByLabel('More information');
    await icon.focus();
    await expect(icon).toBeFocused();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.getByRole('button', {name: 'Remove item'}).click();
    const confirm = page.getByRole('alertdialog', {name: 'Remove item?'});
    await expect(confirm.getByRole('button', {name: 'Cancel'})).toBeFocused();
    await confirm.getByRole('button', {name: 'Cancel'}).click();
    await expect(page.getByText('Example item', {exact: true})).toBeVisible();
    await page.getByRole('button', {name: 'Remove item'}).click();
    await confirm.getByRole('button', {name: 'Remove', exact: true}).click();
    await expect(page.getByRole('heading', {name: 'No items'})).toBeVisible();
    await page.getByRole('button', {name: 'Try loading'}).click();
    await expect(page.getByRole('button', {name: 'Try loading'})).toBeDisabled();
    await expect(page.getByText('Loading complete.')).toBeVisible();
});

test('SlideDown preserves state and tabs support the keyboard', async ({page}) => {
    await page.goto('/#motion');
    const panel = page.locator('#sliding-details');
    await expect(panel).toHaveAttribute('inert', '');
    await page.getByRole('button', {name: 'Open SlideDown'}).click();
    await page.getByLabel('Retained value').fill('Keep this');
    await page.getByRole('button', {name: 'Add content'}).click();
    await expect(page.getByText('Additional content changes the height of this panel.')).toBeVisible();
    await page.getByRole('button', {name: 'Close SlideDown'}).click();
    await expect(panel).toHaveAttribute('inert', '');
    await page.getByRole('button', {name: 'Open SlideDown'}).click();
    await expect(page.getByLabel('Retained value')).toHaveValue('Keep this');
    await page.getByLabel('Tab draft').fill('Retained draft');
    await page.getByRole('tab', {name: 'First tab', exact: true}).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', {name: 'Second tab', exact: true})).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', {name: 'Second tab'})).toBeVisible();
    await expect(page.getByLabel('Tab draft')).toBeHidden();
    await page.keyboard.press('Home');
    await expect(page.getByLabel('Tab draft')).toHaveValue('Retained draft');
    await page.getByRole('button', {name: 'Select third tab'}).click();
    await expect(page.getByRole('tab', {name: 'Third tab', exact: true})).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', {name: 'Third tab'})).toBeVisible();
});

test('native disclosures keep drafts and skip closed content during collapse', async ({page}) => {
    await page.goto('/#motion');
    const summary = page.locator('summary').filter({hasText: 'Native disclosure'});
    const draft = page.getByLabel('Disclosure draft');
    await expect(summary).toBeVisible();
    await summary.press('Enter');
    await expect(draft).toBeVisible();
    await draft.fill('Keep this too');
    await summary.press('Enter');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', {name: 'First accordion'})).toBeFocused();
    await expect(draft).toBeHidden();
    await summary.press('Space');
    await expect(draft).toHaveValue('Keep this too');
});

test('server validation and email previews work on the main gallery', async ({page}) => {
    await page.goto('/');
    const email = page.getByLabel('Your email');
    await page.getByLabel('Project name').fill('Example project');
    await email.fill('incomplete');
    await page.getByRole('button', {name: 'Validate form'}).click();
    await expect(email).toHaveAccessibleDescription('Enter a valid email address.');
    await expect(page.getByLabel('Project name')).toHaveValue('Example project');
    await email.fill('alex@example.com');
    await page.getByRole('spinbutton', {name: 'People', exact: true}).fill('4');
    await page.getByRole('button', {name: 'Validate form'}).click();
    await expect(page.getByRole('heading', {name: 'Example project'})).toBeVisible();
    await expect(page.getByText('Valid form · 4 people · CHF 76.00')).toBeVisible();
    await expect(page.frameLocator('#server-example iframe').getByRole('heading', {name: 'Example project'})).toBeVisible();
    const mail = page.locator('#mail');
    await expect(mail.frameLocator('iframe').first().getByRole('heading', {name: 'Welcome, Alex!'})).toBeVisible();
    await page.getByRole('tab', {name: 'Project email'}).click();
    await expect(mail.frameLocator('iframe').nth(1).getByRole('heading', {name: 'Sunday Studio'})).toBeVisible();
    await expect(page).toHaveURL('/');
    for (const path of ['/project', '/mail']) {
        await page.goto(path);
        await expect(page.getByRole('heading', {name: 'Page not found'})).toBeVisible();
    }
});

test('gallery fits mobile and respects reduced motion', async ({page, request}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/');
    await page.getByRole('button', {name: 'Open SlideDown'}).click();
    await expect(page.getByLabel('Retained value')).toBeVisible();
    expect(await page.locator('#sliding-details').evaluate(node => node.getAnimations({subtree: true}).length)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const selection = page.getByRole('combobox', {name: 'Select an option'});
    await selection.selectOption('third');
    await expect(selection).toHaveValue('third');
    await page.getByRole('tab', {name: 'Second tab', exact: true}).click();
    await expect(page.getByRole('tabpanel', {name: 'Second tab'})).toBeVisible();
    await page.goto('/missing-page');
    await expect(page.getByRole('heading', {name: 'Page not found'})).toBeVisible();
    expect(await (await request.get('/api/health')).json()).toEqual({status: 'ok'});
});

test('development assets allow the Coder workspace and reject unrelated origins', async ({request}) => {
    test.skip(process.env.PLAYWRIGHT_DEV !== '1', 'Development-only asset restrictions');
    const html = await (await request.get('/')).text();
    const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&')).filter(src => src.startsWith('/_next/'));
    expect(scripts.length).toBeGreaterThan(0);
    const origin = 'https://3000--main--seppos--nicksaxer.dev.guildmarket.net';
    for (const src of scripts) {
        const response = await request.get(src, {headers: {Origin: origin}});
        expect(response.status(), src).toBe(200);
        expect(response.headers()['content-type']).toContain('javascript');
    }
    const script = await request.get(scripts[0], {headers: {'Sec-Fetch-Mode': 'no-cors', 'Sec-Fetch-Site': 'cross-site', Referer: `${origin}/`}});
    expect(script.status()).toBe(200);
    expect((await request.get(scripts[0], {headers: {Origin: 'https://untrusted.example'}})).status()).toBe(403);
});

test('a pending navigation hint leaves the current page visible', async ({page}) => {
    let finishRequest: () => void = () => {};
    const responseGate = new Promise<void>(resolve => {finishRequest = resolve;});
    await page.route(url => url.pathname === '/' && url.searchParams.has('_rsc'), async route => {
        const headers = route.request().headers();
        if (headers['next-router-prefetch'] || headers['next-router-segment-prefetch']) {await route.abort(); return;}
        await responseGate;
        await route.continue();
    });
    try {
        await page.goto('/missing-page');
        const link = page.getByRole('link', {name: 'Back to component library'});
        const hint = link.locator('[data-pending]');
        await expect(hint).toHaveAttribute('data-pending', 'false');
        await link.click();
        await expect(hint).toHaveAttribute('data-pending', 'true');
        await expect.poll(() => hint.evaluate(node => getComputedStyle(node, '::after').opacity)).toBe('1');
        await expect(page.getByRole('heading', {name: 'Page not found'})).toBeVisible();
    } finally {
        finishRequest();
    }
    await expect(page.getByRole('heading', {name: 'Component library', exact: true})).toBeVisible();
});

test('alert variants show supplied text, trap focus, and resolve after dismissal', async ({page}) => {
    await page.goto('/#feedback');
    await page.getByLabel('Alert title', {exact: true}).fill('Saved <example>');
    await page.getByLabel('Alert content', {exact: true}).fill('First line\n<strong>Literal text</strong>');
    for (const type of ['info', 'warning', 'error', 'success']) {
        const opener = page.getByRole('button', {name: `Show ${type} alert`, exact: true});
        await opener.click();
        const alert = page.getByRole('alertdialog');
        await expect(alert).toHaveAccessibleName('Saved <example>');
        await expect(alert).toHaveAccessibleDescription('First line <strong>Literal text</strong>');
        await expect(alert.locator('strong')).toHaveCount(0);
        await expect(alert).toHaveAttribute('aria-modal', 'true');
        const close = alert.getByRole('button', {name: 'Close alert', exact: true});
        const ok = alert.getByRole('button', {name: 'OK', exact: true});
        if (type === 'info') {
            await expect(close).toBeVisible();
            await expect(ok).toBeFocused();
            await page.keyboard.press('Tab');
            await expect(close).toBeFocused();
            await page.keyboard.press('Shift+Tab');
            await expect(ok).toBeFocused();
            await page.keyboard.press('Escape');
        }
        else if (type === 'warning') {await close.click();}
        else if (type === 'error') {await page.mouse.click(2, 2);}
        else {await ok.click();}
        await expect(alert).toHaveCount(0);
        await expect(opener).toBeFocused();
        await expect(page.getByText(`${type[0].toUpperCase()}${type.slice(1)} alert dismissed.`, {exact: true})).toBeVisible();
    }
});

test('queued alerts display once in order and restore focus after the last dismissal', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto('/#feedback');
    const opener = page.getByRole('button', {name: 'Show queued alerts'});
    await opener.click();
    const alert = page.getByRole('alertdialog');
    await expect(alert).toHaveCount(1);
    await expect(alert).toHaveAccessibleName('First alert');
    const bounds = await alert.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
    await alert.getByRole('button', {name: 'OK', exact: true}).click();
    await expect(alert).toHaveCount(1);
    await expect(alert).toHaveAccessibleName('Second alert');
    await page.keyboard.press('Escape');
    await expect(alert).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect(page.getByText('Both alerts dismissed.')).toBeVisible();
});

test('profile pictures use the fallback when their image fails', async ({page}) => {
    await page.route('**/favicon.ico', route => route.fulfill({status: 404}));
    await page.goto('/#feedback');
    const fallback = page.getByRole('img', {name: 'Default profile picture'});
    await fallback.scrollIntoViewIfNeeded();
    await expect(fallback).toBeVisible();
    const avatar = page.getByRole('img', {name: 'Template icon'});
    await expect.poll(() => avatar.evaluate(node => !(node instanceof HTMLImageElement) || node.naturalWidth > 0)).toBe(true);
    await expect(avatar).toBeVisible();
});

test('the alert remains usable without animation when reduced motion is requested', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/#feedback');
    await page.getByRole('button', {name: 'Show info alert', exact: true}).click();
    const alert = page.getByRole('alertdialog');
    await expect(alert.getByText('Example alert message.', {exact: true})).toBeVisible();
    expect(await alert.evaluate(node => node.getAnimations({subtree: true}).length)).toBe(0);
    await alert.getByRole('button', {name: 'OK', exact: true}).click();
    await expect(alert).toBeHidden();
});
