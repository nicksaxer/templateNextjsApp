import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, watch } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { stripVTControlCharacters } from 'node:util';

const npmCli = process.env.npm_execpath ?? '';
if (!npmCli) {throw new Error('Start development with npm run dev.');}

const require = createRequire(resolve('package.json'));
const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...process.argv.slice(2)], {stdio: ['inherit', 'pipe', 'inherit']});
server.stdout.pipe(process.stdout, {end: false});

const watcher = new AbortController();
const useProcessGroup = process.platform !== 'win32';
let appURL: string | undefined;
let timer: NodeJS.Timeout | undefined;
let testProcess: ChildProcess | undefined;
let pending = false;

function runTest(args: string[], env = process.env) {
    return new Promise<number | null>(resolve => {
        const child = spawn(process.execPath, [npmCli, ...args], {env, detached: useProcessGroup, stdio: ['ignore', 'inherit', 'inherit']});
        testProcess = child;
        child.once('error', error => {console.error('[dev] Could not start tests.', error);});
        child.once('close', code => {testProcess = undefined; resolve(code);});
    });
}

async function runTests() {
    if (!appURL || testProcess || watcher.signal.aborted) {return;}
    pending = false;
    console.log('[dev] Running unit and browser tests…');
    const unit = await runTest(['test']);
    if (watcher.signal.aborted) {return;}
    const browser = await runTest(['run', 'test:e2e', '--', '--workers=2'], {...process.env, PLAYWRIGHT_DEV: '1', PLAYWRIGHT_DEV_URL: appURL});
    if (watcher.signal.aborted) {return;}
    console.log(unit === 0 && browser === 0 ? '[dev] Tests passed.' : '[dev] Tests failed.');
    if (pending) {queueTests();}
}

function queueTests() {
    pending = true;
    clearTimeout(timer);
    timer = setTimeout(runTests, 400);
}

createInterface({input: server.stdout}).on('line', line => {
    // Next reports the actual address, including when it selects a different port.
    const url = stripVTControlCharacters(line).match(/^\s*-\s+Local:\s+(https?:\/\/\S+)/)?.[1];
    if (!url || watcher.signal.aborted) {return;}
    if (!appURL) {
        for (const directory of ['src', 'tests', 'public']) {
            if (!existsSync(directory)) {continue;}
            const reportError = (error: unknown) => {console.error(`[dev] Could not watch ${directory}.`, error);};
            try {watch(directory, {recursive: true, signal: watcher.signal}, queueTests).on('error', reportError);}
            catch (error) {reportError(error);}
        }
    }
    appURL = url;
    queueTests();
});

function stopWatching() {
    if (watcher.signal.aborted) {return;}
    watcher.abort();
    clearTimeout(timer);
    const pid = testProcess?.pid;
    if (!pid) {return;}
    try {
        if (useProcessGroup) {process.kill(-pid, 'SIGTERM');}
        else {testProcess?.kill('SIGTERM');}
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ESRCH') {throw error;}
    }
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {stopWatching(); server.kill(signal);});
}
server.once('error', error => {console.error(error);});
server.once('close', (code, signal) => {
    stopWatching();
    process.exitCode = code ?? (signal === 'SIGINT' ? 130 : signal === 'SIGTERM' ? 143 : 1);
});
