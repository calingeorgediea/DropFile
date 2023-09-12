const fs = require('fs');
const path = require('path');

function buildFileTree(basePath, directory) {

    const stats = fs.statSync(directory);
    if (!stats.isDirectory()) {
      return null; // Return null for files
    }
  
    const files = fs.readdirSync(directory);
    const tree = {
      name: path.basename(directory),
      type: 'directory',
      children: [],
    };
  
    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileStats = fs.statSync(filePath);
      if (fileStats.isDirectory()) {
        const subtree = buildFileTree(basePath, filePath);
        if (subtree) {
          tree.children.push(subtree);
        }
      } else {
        tree.children.push({
          name: file,
          type: 'file',
        });
      }
    }
  
    return tree;
  }

module.exports = buildFileTree;