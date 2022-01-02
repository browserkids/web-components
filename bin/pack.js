#!/usr/bin/env node
const { readdir, readFile, writeFile } = require('fs').promises;
const { resolve, join } = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const terser = require('terser');

const { name, version } = require('../package.json');
const { parserOptions: { ecmaVersion: ecma } } = require('../.eslintrc.json');

const root = resolve(__dirname, '..');
const sourceDirectory = resolve(root, 'src');
const targetPath = resolve(root, 'index.js');

async function minify(code) {
  return (await terser.minify(code, { ecma })).code;
}

async function* list(path) {
  const entries = await readdir(path, { withFileTypes: true });

  for (const file of entries) {
    const filePath = join(path, file.name);

    if (file.isDirectory()) {
      yield* list(filePath);
    } else {
      yield filePath;
    }
  }
}

(async () => {
  let contents = '';

  console.log('📦  Processing files…\n');

  for await (const file of list(sourceDirectory)) {
    contents += (await readFile(file))
      .toString()
      .replace(/export default/g, 'export');

    console.log(file.replace(sourceDirectory, '.'));
  }

  await writeFile(
    targetPath,
    await minify(`/*! ${name}@${version} */${contents}`),
  );

  console.log('\n\n👏  Done.\n');
})();
