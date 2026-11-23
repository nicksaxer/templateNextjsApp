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
let testRun = Promise.resolve();
let queued = false;

function stop(code: number, error?: unknown) {
    if (signal.aborted) {return;}
    shutdown.abort();
    server.kill();
    process.exitCode = code;
    if (error) {console.error('[dev]', error);}
}

server.once('error', error => stop(1, error));
server.once('close', code => stop(code ?? 1));
process.once('SIGINT', () => stop(130));
process.once('SIGTERM', () => stop(143));

function queueTests() {
    if (queued || signal.aborted) {return;}
    queued = true;
    testRun = testRun.then(async () => {
        await delay(150, undefined, {signal});
        queued = false;
        console.log('\n[test] Running Node tests');
        const report = run({globPatterns: ['scripts/tests/*.test.ts'], execArgv: ['--conditions=react-server', '--import', 'tsx'], concurrency: true, signal}).compose(spec);
        report.pipe(process.stdout, {end: false});
        await finished(report, {cleanup: true});
    }).catch(error => stop(1, error));
}

try {
    for (const directory of ['src', 'scripts', 'public'].filter(existsSync)) {
        watch(directory, {recursive: true, signal}, queueTests).on('error', error => stop(1, error));
    }
    queueTests();
} catch (error) {stop(1, error);}
