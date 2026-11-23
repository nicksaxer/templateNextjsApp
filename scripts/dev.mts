import { spawn } from 'node:child_process';
import { existsSync, watch } from 'node:fs';
import { createRequire } from 'node:module';
import { finished } from 'node:stream/promises';
import { run } from 'node:test';
import { spec } from 'node:test/reporters';

const require = createRequire(import.meta.url);
const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...process.argv.slice(2)], {stdio: 'inherit'});
const shutdown = new AbortController();
let timer: NodeJS.Timeout | undefined;
let testing = false;
let rerun = false;

function stop(code: number, signal: NodeJS.Signals = 'SIGTERM') {
    if (shutdown.signal.aborted) {return;}
    clearTimeout(timer);
    shutdown.abort();
    server.kill(signal);
    process.exitCode = code;
}

function reportError(error: unknown) {
    if (shutdown.signal.aborted) {return;}
    console.error('[dev]', error);
    stop(1);
}

async function runTests() {
    if (shutdown.signal.aborted) {return;}
    if (testing) {rerun = true; return;}
    testing = true;
    rerun = false;
    try {
        console.log('\n[test] Running Node tests');
        // Use the same files and Node flags as npm test.
        const output = run({
            globPatterns: ['tests/*.test.ts'],
            execArgv: ['--conditions=react-server', '--import', 'tsx'],
            concurrency: true,
            signal: shutdown.signal
        }).compose(spec);
        output.pipe(process.stdout, {end: false});
        await finished(output);
    } catch (error) {reportError(error);}
    finally {
        testing = false;
        if (rerun) {scheduleTests();}
    }
}

function scheduleTests() {
    if (shutdown.signal.aborted) {return;}
    clearTimeout(timer);
    timer = setTimeout(runTests, 200);
}

server.once('error', reportError);
server.once('close', code => stop(code ?? 1));
process.once('SIGINT', () => stop(130, 'SIGINT'));
process.once('SIGTERM', () => stop(143));

try {
    for (const directory of ['src', 'tests', 'public']) {
        if (existsSync(directory)) {watch(directory, {recursive: true, signal: shutdown.signal}, scheduleTests).on('error', reportError);}
    }
    void runTests();
} catch (error) {reportError(error);}
