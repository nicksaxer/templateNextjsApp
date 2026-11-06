import { test as base, expect } from '@playwright/test';

const test = base.extend({
    page: async ({page}, runPage) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await runPage(page);
        expect(errors, 'Client-side errors').toEqual([]);
    }
});

test('source controls support typing, steppers, custom selection, and reset', async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Component library', exact: true})).toBeVisible();
    await page.getByLabel('Text', {exact: true}).fill('Example');
    await page.getByRole('button', {name: 'Show password'}).click();
    await expect(page.getByLabel('Password', {exact: true})).toHaveAttribute('type', 'text');
    await page.getByRole('button', {name: 'Increase Quantity'}).click();
    await expect(page.getByRole('spinbutton', {name: 'Quantity', exact: true})).toHaveValue('4');
    await page.getByRole('combobox', {name: 'Select an option'}).click();
    await page.getByRole('option', {name: 'Third option'}).click();
    await expect(page.getByText('Selected: third')).toBeVisible();
    const switchInput = page.getByRole('switch', {name: 'Example switch'});
    await switchInput.focus();
    await page.keyboard.press('Space');
    await expect(switchInput).not.toBeChecked();
    await page.getByRole('button', {name: 'Reset inputs'}).click();
    await expect(page.getByLabel('Text', {exact: true})).toHaveValue('');
    await expect(page.getByRole('spinbutton', {name: 'Quantity', exact: true})).toHaveValue('3');
    await expect(page.getByText('Selected: second')).toBeVisible();
    await expect(switchInput).toBeChecked();
    await page.getByRole('combobox', {name: 'Select an option'}).focus();
    await page.keyboard.press('Home');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Selected: first')).toBeVisible();
    expect(errors).toEqual([]);
});

test('original palette, borders, typography, moving labels, and theme work', async ({page}) => {
    const response = await page.goto('/');
    expect(await response!.text()).toMatch(/<html[^>]*data-theme="dark"[^>]*data-palette="guildmarket"/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'guildmarket');
    await expect(page.getByRole('button', {name: 'GuildMarket', exact: true})).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('switch', {name: 'Dark mode'})).toBeChecked();
    const button = page.getByRole('button', {name: 'Default', exact: true});
    await expect(button).toHaveCSS('border-top-color', 'rgb(0, 150, 168)');
    await expect(button).toHaveCSS('border-top-width', '2px');
    await expect(button).toHaveCSS('height', '48px');
    await expect(page.locator('body')).toHaveCSS('font-family', /Rubik Variable/);
    await button.hover();
    await expect(button).toHaveCSS('background-color', 'rgb(0, 150, 168)');
    const input = page.getByLabel('Text', {exact: true});
    await input.focus();
    await expect(page.locator('label', {hasText: /^Text$/})).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await page.getByRole('switch', {name: 'Dark mode'}).focus();
    await page.keyboard.press('Space');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('switch', {name: 'Dark mode'})).not.toBeChecked();
    await page.getByRole('button', {name: 'SeppOS', exact: true}).click();
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'seppos');
    await page.getByRole('button', {name: 'GuildMarket', exact: true}).click();
    await page.getByRole('switch', {name: 'Dark mode'}).focus();
    await page.keyboard.press('Space');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(16, 16, 16)');
    await expect(page.getByRole('navigation')).toHaveCount(0);
});

test('feedback, tooltip, empty state, and loading examples work', async ({page}) => {
    await page.goto('/#feedback');
    await page.getByLabel('More information').focus();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.getByRole('button', {name: 'Add item', exact: true}).click();
    await expect(page.getByText('Example item', {exact: true})).toBeVisible();
    await page.getByRole('button', {name: 'Remove item'}).click();
    await expect(page.getByRole('heading', {name: 'No items'})).toBeVisible();
    await page.getByRole('button', {name: 'Try loading'}).click();
    await expect(page.getByRole('button', {name: 'Try loading'})).toBeDisabled();
    await expect(page.getByText('Loading complete.')).toBeVisible();
});

test('SlideDown preserves state and tabs and dialog support the keyboard', async ({page}) => {
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
    await page.getByRole('tab', {name: 'First tab', exact: true}).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', {name: 'Second tab', exact: true})).toHaveAttribute('aria-selected', 'true');
    const opener = page.getByRole('button', {name: 'Open dialog'});
    await opener.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(opener).toBeFocused();
});

test('server validation and email previews remain functional', async ({page}) => {
    await page.goto('/project');
    await page.getByLabel('Project name').fill('Example project');
    await page.getByLabel('Your email').fill('incomplete');
    await page.getByRole('button', {name: 'Validate form'}).click();
    await expect(page.getByText('Enter a valid email address.')).toBeVisible();
    await expect(page.getByLabel('Project name')).toHaveValue('Example project');
    await page.getByLabel('Your email').fill('alex@example.com');
    await page.getByRole('spinbutton', {name: 'People', exact: true}).fill('4');
    await page.getByRole('button', {name: 'Validate form'}).click();
    await expect(page.getByRole('heading', {name: 'Example project'})).toBeVisible();
    await expect(page.getByText('Valid form · 4 people · CHF 76.00')).toBeVisible();
    await expect(page.frameLocator('iframe').getByRole('heading', {name: 'Example project'})).toBeVisible();
    await page.goto('/mail');
    await expect(page.frameLocator('iframe').first().getByRole('heading', {name: 'Welcome, Alex!'})).toBeVisible();
    await page.getByRole('tab', {name: 'Project email'}).click();
    await expect(page.frameLocator('iframe').nth(1).getByRole('heading', {name: 'Sunday Studio'})).toBeVisible();
});

test('gallery fits mobile and respects reduced motion', async ({page, request}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/');
    await page.getByRole('button', {name: 'Open SlideDown'}).click();
    await expect(page.getByLabel('Retained value')).toBeVisible();
    expect(await page.locator('#sliding-details').evaluate(node => getComputedStyle(node).transitionDuration)).toBe('0s');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('combobox', {name: 'Select an option'}).click();
    const menu = page.getByRole('listbox');
    await expect(menu).toBeVisible();
    const bounds = await menu.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
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

test('alert variants show supplied text, trap focus, and resolve after dismissal', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'});
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
        const icon = alert.locator('svg');
        const animationCount = await icon.evaluate(async node => {
            const animations = node.getAnimations({subtree: true});
            await Promise.all(animations.map(animation => animation.finished));
            return animations.length;
        });
        expect(animationCount).toBeGreaterThan(0);
        const iconBounds = (await icon.boundingBox())!;
        const dialogBounds = (await alert.boundingBox())!;
        expect(iconBounds.width).toBeGreaterThanOrEqual(96);
        expect(Math.abs(iconBounds.x + iconBounds.width / 2 - dialogBounds.x - dialogBounds.width / 2)).toBeLessThan(1);
        await expect(icon).toBeVisible();
        await alert.getByRole('button', {name: 'OK', exact: true}).focus();
        await page.keyboard.press('Tab');
        await expect(alert.getByRole('button', {name: 'Close dialog'})).toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await expect(alert.getByRole('button', {name: 'OK', exact: true})).toBeFocused();
        if (type === 'info') {await page.keyboard.press('Escape');}
        else if (type === 'warning') {await alert.getByRole('button', {name: 'Close dialog'}).click();}
        else if (type === 'error') {await page.mouse.click(2, 2);}
        else {await alert.getByRole('button', {name: 'OK', exact: true}).click();}
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

test('alert icons remain fully visible without animation when reduced motion is requested', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/#feedback');
    for (const type of ['info', 'warning', 'error', 'success']) {
        await page.getByRole('button', {name: `Show ${type} alert`, exact: true}).click();
        const alert = page.getByRole('alertdialog');
        const icon = alert.locator('svg');
        await expect(icon).toBeVisible();
        await expect(icon).toHaveCSS('opacity', '1');
        expect(await icon.evaluate(node => node.getAnimations({subtree: true}).length)).toBe(0);
        const offsets = await icon.locator('path').evaluateAll(paths => paths.map(path => parseFloat(getComputedStyle(path).strokeDashoffset)));
        expect(offsets.every(offset => offset === 0)).toBe(true);
        await expect(alert.getByText('Example alert message.', {exact: true})).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(alert).toHaveCount(0);
    }
});
