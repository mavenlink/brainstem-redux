const findAllFilesWithExt = require('./find-all-files-with-ext.js');

module.exports = function findAllFilesInDirectory(fileDirectories, extension) {
  // eslint-disable-next-line arrow-body-style
  return fileDirectories.reduce((memo, directory) => {
    return memo.concat(findAllFilesWithExt(directory, extension));
  }, []);
};
