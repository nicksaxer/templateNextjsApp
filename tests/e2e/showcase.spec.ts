import { test, expect } from '@playwright/test';

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
    await page.goto('/');
    await page.getByRole('button', {name: 'GuildMarket', exact: true}).click();
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
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
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
