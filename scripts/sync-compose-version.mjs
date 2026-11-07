import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const version = process.env.npm_package_version;
const gitTagVersion = process.env.npm_config_git_tag_version;
const buildPath = 'compose.yaml';
const runtimePath = 'compose.portainer.yaml';
const build = readFileSync(buildPath, 'utf8');
const runtime = readFileSync(runtimePath, 'utf8');
const imageVersion = /^([ \t]+image: \S+:)\S+( # Managed by npm version)$/m;
const buildVersion = /^([ \t]+APP_VERSION: ')[^']+'$/m;

if (!version || !imageVersion.test(runtime) || !buildVersion.test(build)) {throw new Error('Could not sync the application version in the Compose files.');}

writeFileSync(buildPath, build.replace(buildVersion, (_, arg) => `${arg}${version}'`));
writeFileSync(runtimePath, runtime.replace(imageVersion, (_, image, comment) => `${image}${version}${comment}`));
if (gitTagVersion !== '' && gitTagVersion !== 'false') {execFileSync('git', ['add', '--', buildPath, runtimePath]);}
