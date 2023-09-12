const fs = require('fs');

function listFolderContent(directory) {
  const files = fs.readdirSync(directory);
  return files;
}

module.exports = listFolderContent;