import { defineConfig, devices } from '@playwright/test';

const development = process.env.PLAYWRIGHT_DEV === '1';
const port = development ? 3001 : 3000;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    use: {
        baseURL, trace: 'retain-on-failure',
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : undefined
    },
    projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
    webServer: {command: `npm run ${development ? 'dev' : 'start'} -- --hostname 127.0.0.1 --port ${port}`, url: `${baseURL}/api/health`, reuseExistingServer: false, timeout: 60_000}
});
