#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const terser = require('terser');

const { name, version } = require('../package.json');

const root = path.resolve(__dirname, '..');
const sourceDirectory = path.resolve(root, 'src');
const targetDirectory = root;
const targetPath = path.resolve(root, 'index.js');

function minify(code) {
  return terser.minify(code, { ecma: 9 }).code;
}

(async () => {
  const sourcePaths = await fs.readdir(sourceDirectory);
  const sourceFiles = await Promise.all(sourcePaths.map((filePath) => fs.readFile(path.resolve(sourceDirectory, filePath))));
  const sourceNames = sourcePaths.map((item) => path.basename(item, '.js'));

  let contents = '';

  console.log('📦  Processing files…\n');

  sourcePaths.forEach((sourcePath, index) => {
    const code = sourceFiles[index].toString();

    contents += code.replace(/export default/g, 'export');

    fs.writeFile(path.resolve(targetDirectory, sourcePath), minify(`/*! ${name}@${version} */${code}`));

    console.log(`✓ ${sourcePath}`);
  });

  await fs.writeFile(targetPath, minify(`/*! ${name}@${version} */${contents} export default { ${sourceNames} }`));

  console.log('✓ index.js');
  console.log('\n\n👏  Done.\n');
})();
