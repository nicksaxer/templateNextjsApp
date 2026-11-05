import { test, expect } from '@playwright/test';

test('the essentials support typing, native form reset, empty states, and loading', async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('heading', {name: /Start with/})).toBeVisible();
    await page.getByLabel('Your name', {exact: true}).fill('Alex');
    await page.getByLabel('Password', {exact: true}).fill('a little secret');
    await page.getByRole('button', {name: 'Show password'}).click();
    await expect(page.getByLabel('Password', {exact: true})).toHaveAttribute('type', 'text');
    await page.getByRole('switch', {name: 'Keep me in the loop'}).uncheck();
    await page.getByRole('button', {name: 'Save details'}).click();
    await expect(page.getByText('Looking good. Your details are ready.')).toBeVisible();
    await page.getByRole('button', {name: 'Reset', exact: true}).click();
    await expect(page.getByLabel('Your name', {exact: true})).toHaveValue('');
    await expect(page.getByRole('switch', {name: 'Keep me in the loop'})).toBeChecked();
    await page.getByRole('button', {name: 'Add an idea'}).click();
    await expect(page.getByText('Your first little idea')).toBeVisible();
    await page.getByRole('button', {name: 'Remove idea'}).click();
    await expect(page.getByRole('heading', {name: 'Room for something good'})).toBeVisible();
    await page.getByRole('button', {name: 'Try loading'}).click();
    await expect(page.getByText('Getting things ready…')).toBeVisible();
    await expect(page.getByText('Everything is up to date.')).toBeVisible();
});

test('motion preserves state, keyboard tabs and dialog focus work', async ({page}) => {
    await page.goto('/#motion');
    const panel = page.locator('#sliding-details');
    await expect(panel).toHaveAttribute('inert', '');
    await page.getByRole('button', {name: 'Show the details'}).click();
    await page.getByLabel('A detail worth keeping').fill('Keep this');
    await page.getByRole('button', {name: 'Tell me more'}).click();
    await expect(page.getByText('There’s always room for one more good idea. Even when the story gets a little longer.')).toBeVisible();
    await page.getByRole('button', {name: 'Hide the details'}).click();
    await expect(panel).toHaveAttribute('inert', '');
    await page.getByRole('button', {name: 'Show the details'}).click();
    await expect(page.getByLabel('A detail worth keeping')).toHaveValue('Keep this');
    await page.getByRole('tab', {name: 'A gentle arrival'}).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', {name: 'A focused moment'})).toHaveAttribute('aria-selected', 'true');
    const opener = page.getByRole('button', {name: 'Open a moment'});
    await opener.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(opener).toBeFocused();
});

test('the server validates a draft and renders a real email preview', async ({page}) => {
    const browserErrors: string[] = [];
    page.on('pageerror', error => browserErrors.push(error.message));
    await page.goto('/project');
    await page.getByLabel('Project name').fill('Sunday Studio');
    await page.getByLabel('Your email').fill('incomplete');
    await page.getByRole('button', {name: 'Preview my project'}).click();
    await expect(page.getByText('Enter a valid email address.')).toBeVisible();
    await expect(page.getByLabel('Project name')).toHaveValue('Sunday Studio');
    await page.getByLabel('Your email').fill('alex@example.com');
    await page.getByLabel('People', {exact: true}).fill('4');
    await page.getByRole('button', {name: 'Preview my project'}).click();
    await expect(page.getByRole('heading', {name: 'Sunday Studio'})).toBeVisible();
    await expect(page.getByText('CHF 76.00').last()).toBeVisible();
    const mail = page.frameLocator('iframe');
    await expect(mail.getByRole('heading', {name: 'A little room for Sunday Studio.'})).toBeVisible();
    await expect(mail.getByText('CHF 76.00')).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', {name: 'Your idea goes here'})).toBeVisible();
    expect(browserErrors).toEqual([]);
});

test('mail tabs and theme persist across navigation and reload', async ({page}) => {
    await page.goto('/mail');
    await expect(page.frameLocator('iframe').first().getByRole('heading', {name: 'Make yourself at home, Alex.'})).toBeVisible();
    await page.getByRole('tab', {name: 'A new beginning'}).click();
    await expect(page.frameLocator('iframe').nth(1).getByRole('heading', {name: 'A little room for Sunday Studio.'})).toBeVisible();
    await page.getByRole('button', {name: 'Switch to dark mode'}).click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('link', {name: 'A new project', exact: true}).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('mobile navigation, reduced motion, not-found, and health endpoint work', async ({page, request}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/');
    await page.getByRole('button', {name: 'Toggle navigation'}).click();
    await page.getByRole('link', {name: 'Motion & interaction', exact: true}).click();
    await expect(page.getByRole('button', {name: 'Toggle navigation'})).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('button', {name: 'Show the details'}).click();
    await expect(page.getByLabel('A detail worth keeping')).toBeVisible();
    expect(await page.locator('#sliding-details').evaluate(node => getComputedStyle(node).transitionDuration)).toBe('0s');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto('/missing-page');
    await expect(page.getByRole('heading', {name: 'A little off the beaten path'})).toBeVisible();
    const health = await request.get('/api/health');
    expect(await health.json()).toEqual({status: 'ok'});
});
