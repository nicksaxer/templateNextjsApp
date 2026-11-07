import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const version = process.env.npm_package_version;
const gitTagVersion = process.env.npm_config_git_tag_version;
const compose = readFileSync('compose.yaml', 'utf8');
const imageVersion = /^([ \t]+image: \S+:)\S+( # Managed by npm version)$/m;
const buildVersion = /^([ \t]+APP_VERSION: ')[^']+'$/m;

if (!version || !imageVersion.test(compose) || !buildVersion.test(compose)) {throw new Error('Could not sync the application version in compose.yaml.');}

const updated = compose.replace(imageVersion, (_, image, comment) => `${image}${version}${comment}`).replace(buildVersion, (_, arg) => `${arg}${version}'`);
writeFileSync('compose.yaml', updated);
if (gitTagVersion !== '' && gitTagVersion !== 'false') {execFileSync('git', ['add', '--', 'compose.yaml']);}
