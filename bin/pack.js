#!/usr/bin/env node
const { readdir, readFile, writeFile } = require('fs').promises;
const { resolve, basename } = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const terser = require('terser');

const { name, version } = require('../package.json');

const root = resolve(__dirname, '..');
const sourceDirectory = resolve(root, 'src');
const targetDirectory = root;
const targetPath = resolve(root, 'index.js');

async function minify(code) {
  return (await terser.minify(code, { ecma: 9 })).code;
}

(async () => {
  const sourcePaths = await readdir(sourceDirectory);
  const sourceFiles = await Promise.all(sourcePaths.map((filePath) => readFile(resolve(sourceDirectory, filePath))));
  const sourceNames = sourcePaths.map((item) => basename(item, '.js'));

  let contents = '';

  console.log('📦  Processing files…\n');

  await Promise.all(
    sourcePaths.map(async (sourcePath, index) => {
      const code = sourceFiles[index].toString();

      contents += code.replace(/export default/g, 'export');

      await writeFile(
        resolve(targetDirectory, sourcePath),
        await minify(`/*! ${name}@${version} */${code}`),
      );

      console.log(`✓ ${sourcePath}`);
    }),
  );

  await writeFile(
    targetPath,
    await minify(`/*! ${name}@${version} */${contents} export default { ${sourceNames} }`),
  );

  console.log('✓ index.js');
  console.log('\n\n👏  Done.\n');
})();
