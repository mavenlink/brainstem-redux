const fs = require('fs');
const path = require('path');

module.exports = function findAllFilesWithExt(directoryPath, extension) {
  if (!fs.existsSync(directoryPath)) {
    console.log('No directory found:', directoryPath);
    return [];
  }

  const fileNames = fs.readdirSync(directoryPath);

  return fileNames.reduce((filePaths, fileName) => {
    const filePath = path.join(directoryPath, fileName);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      return filePaths.concat(findAllFilesWithExt(filePath, extension));
    } else if (path.extname(filePath) === extension) {
      return filePaths.concat(filePath);
    }

    return filePaths;
  }, []);
};
