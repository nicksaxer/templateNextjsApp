import { spawn } from 'node:child_process';
import { existsSync, watch } from 'node:fs';
import { createRequire } from 'node:module';
import { finished } from 'node:stream/promises';
import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import { setTimeout as delay } from 'node:timers/promises';

const require = createRequire(import.meta.url);
const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...process.argv.slice(2)], {stdio: 'inherit'});
const shutdown = new AbortController();
const {signal} = shutdown;
let testing = false;
let queued = false;

function stop(code: number) {
    if (signal.aborted) {return;}
    shutdown.abort();
    server.kill();
    process.exitCode = code;
}

function reportError(error: unknown) {
    if (signal.aborted) {return;}
    console.error('[dev]', error);
    stop(1);
}

async function runTests() {
    queued = true;
    if (testing || signal.aborted) {return;}
    testing = true;
    try {
        while (queued) {
            await delay(150, undefined, {signal});
            queued = false;
            console.log('\n[test] Running Node tests');
            const report = run({globPatterns: ['tests/*.test.ts'], execArgv: ['--conditions=react-server', '--import', 'tsx'], concurrency: true, signal}).compose(spec);
            report.pipe(process.stdout, {end: false});
            await finished(report, {cleanup: true});
        }
    } catch (error) {reportError(error);}
    finally {testing = false;}
}

server.once('error', reportError);
server.once('close', code => stop(code ?? 1));
process.once('SIGINT', () => stop(130));
process.once('SIGTERM', () => stop(143));

try {
    for (const directory of ['src', 'tests', 'public']) {
        if (existsSync(directory)) {watch(directory, {recursive: true, signal}, runTests).on('error', reportError);}
    }
    void runTests();
} catch (error) {reportError(error);}
