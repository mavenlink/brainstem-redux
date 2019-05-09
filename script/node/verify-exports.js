// COPIED FROM BIGMAVEN
// TODO: Centralize this and other scripts
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const findAllFilesInDirectories = require('./helpers/find-all-files-in-directories.js');

const directoryPaths = [
  path.join(root, 'lib'),
  path.join(root, 'spec'),
  path.join(root, 'example')
];

/**
 * Gets all client files
 * @return {Array} array of client side rendering files.
 */
function getJsJsxFiles() {
  const jsFiles = findAllFilesInDirectories(directoryPaths, '.js');
  const jsxFiles = findAllFilesInDirectories(directoryPaths, '.jsx');
  return [
    ...jsFiles,
    ...jsxFiles,
  ];
}

function handleObjectLiteralAssignment(line) {
  let varName = null;
  // We need to allow: export default (state = { id: null }) => state;
  const regexFunctionWithDefaultParamsObject = /\(.* = {.*}\)/g;

  // If not a (foo = { a: b}) in a function's parameter list
  if (!regexFunctionWithDefaultParamsObject.test(line) && line.includes(' = {')) {
    const splits = line.split(' = {')[0].split(' ');
    const lastWordStr = splits[splits.length - 1];
    const matches = lastWordStr.match(/(\w+)$/);
    if (matches && matches[1]) {
      varName = matches[1];
    }
  }
  return varName;
}

/**
 * Gets import / export violations
 * @param {String} file path
 * @return {Array} returns array containing file if it contains violations or []
 */
function getMixedExports(file) {
  let isBad = false;
  const importStatements = [];
  const moduleExports = [];
  const exportDefaultCommonJS = [];
  const objLiteralVariables = [];

  fs.readFileSync(file, 'utf8').split('\n').forEach((line) => {
    if (line.includes('import') && !line.includes('eslint import/no-commonjs')) {
      // Don't match on quoted e.g. `const foo = 'important thing';` etc. etc.
      const matches = line.match(/(?<!"|'|\w)(import)(?!"|'|\w)/);
      if (matches) {
        importStatements.push(line);
      }
    }
    if (line.includes('module.exports')) {
      const matches = line.trim().match(/^module\.exports/);
      if (matches) {
        moduleExports.push(line);
      }
    }

    const varName = handleObjectLiteralAssignment(line);
    if (varName) {
      objLiteralVariables.push(varName);
    }

    if (line.includes('export default {')) {
      exportDefaultCommonJS.push(line);
    } else if (line.includes('export default ')) {
      // Match the varname in export default variableName
      const splits = line.trim().split(' ');

      const exportedVariable = splits[splits.length - 1].replace(';', '');
      if (objLiteralVariables.includes(exportedVariable)) {
        exportDefaultCommonJS.push(line);
      }
    }
  });

  if (importStatements.length && moduleExports.length) {
    console.log('Bad mixed import/export', file);
    console.log([...importStatements, ...moduleExports]);
    isBad = true;
  }

  if (exportDefaultCommonJS.length) {
    console.log('Bad export default in CommonJS style: ', file);
    console.log([...exportDefaultCommonJS]);
    isBad = true;
  }

  if (isBad) {
    return [file];
  }
  return [];
}

/**
 * Convenience method that takes files and delegates to
 * `getMixedExports` for each file.
 * @param  {Array} files a list of files
 * @return {Array} list of files with violations
 */
function verifyExports(files) {
  return files.reduce((memo, file) => {
    return memo.concat(getMixedExports(file));
  }, []);
}

/**
 * Main
 * @return {$?} [exit code for circleci]
 */
function main() {
  const files = getJsJsxFiles();
  const mixedImportExports = verifyExports(files);
  console.log('Bad import/exports: ', mixedImportExports);

  if (mixedImportExports.length > 0) {
    console.log('\x1b[31m%s\x1b[0m', 'Bad import/exports: Please check the usage mentioned above by running `node script/node/verify-exports.js` locally!');
    console.log('\x1b[36m%s\x1b[0m', 'Also, see RFC: https://github.com/mavenlink/rfc/blob/2019/04-24-no-more-default-export-object-commonjs/2019/04-24-no-more-default-export-object-commonjs.md#prevention.');
  }
  return mixedImportExports.length;
}

module.exports = {
  getJsJsxFiles,
  getMixedExports,
  verifyExports,
  handleObjectLiteralAssignment,
};

// Script is being ran off the command line
if (require.main === module) {
  // Unmanaged server or client rendered SVGs will result in a non-zero
  // exit code causing circleci to fail the PR
  const exitStatus = main();
  process.exit(exitStatus);
}
