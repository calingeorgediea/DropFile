const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const path = require('path');
const fs = require('fs');
const sanitizeFilename = require('sanitize-filename');
const upload = async (req, res) => {
    try {
        // Assuming that the user ID is stored in req.user.id
        const userID = req.user.id;

        // Construct the user storage path based on the user ID
        const userStoragePath = `./DropFile/users/${userID}`;

        if (!fs.existsSync(userStoragePath)) {
            fs.mkdirSync(userStoragePath, { recursive: true });
        }

        res.status(200).json({ message: 'File uploaded successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'File upload failed for user ' + req.user.id });
    }
};

const list = async (req, res) => {
  try {
    // Assuming user ID is available in req.user.id
    const userID = req.user.id;

    // Get the folder path from the request body
    const { folderPath, showStructure } = req.body;

    // Construct the full path to the user's storage directory
    const userStoragePath = path.resolve(`./DropFile/users/${userID}`);

    // If folderPath is empty, return the entire directory structure
    if (!folderPath && showStructure === 'true') {
      const directoryStructure = buildFileTree(userStoragePath, userStoragePath);
      res.status(httpStatus.OK).json({ structure: directoryStructure });
      return;
    }

    // Construct the full path to the requested folder
    const requestedFolderPath = path.resolve(userStoragePath, folderPath || '');

    // Check if the requested folder path is outside the user's storage directory
    if (!requestedFolderPath.startsWith(userStoragePath)) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid folderPath' });
    }

    // Check if the requested folder exists
    if (!fs.existsSync(requestedFolderPath)) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Folder not found' });
    }

    if (showStructure) {
      // Return the entire directory structure
      const directoryStructure = buildFileTree(userStoragePath, requestedFolderPath);
      res.status(httpStatus.OK).json({ structure: directoryStructure });
    } else {
      // Return only the content of the specified path
      const content = listFolderContent(requestedFolderPath);
      res.status(httpStatus.OK).json({ content });
    }
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to list files' });
  }
};

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

function listFolderContent(directory) {
  const files = fs.readdirSync(directory);
  return files;
}



module.exports = {
    upload,
    list
};