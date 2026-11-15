import { defineConfig, devices } from '@playwright/test';

const development = process.env.PLAYWRIGHT_DEV === '1';
const port = development ? 3001 : 3000;
const devURL = development ? process.env.PLAYWRIGHT_DEV_URL : undefined;
const baseURL = devURL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    use: {
        baseURL, trace: 'retain-on-failure', ignoreHTTPSErrors: devURL?.startsWith('https://') ?? false,
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : undefined
    },
    projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
    webServer: devURL ? undefined : {command: `npm run ${development ? 'dev:server' : 'start'} -- --hostname 127.0.0.1 --port ${port}`, url: `${baseURL}/api/health`, reuseExistingServer: false, timeout: 60_000}
});
