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

const rename = async (req, res) => {
    try {
      // Assuming user ID is available in req.user.id
      const userID = req.user.id;
  
      // Get the folder path, old item name, new item name, and item type from the request body
      const { folderPath, oldName, newName, itemType } = req.body;
  
      // Construct the full path to the user's storage directory
      const userStoragePath = path.resolve(`./DropFile/users/${userID}`);
  
      // Determine the base path for renaming (root or folderPath)
      const basePath = folderPath ? path.resolve(userStoragePath, folderPath) : userStoragePath;
  
      // Construct the full paths to the old and new items
      const oldItemPath = path.resolve(basePath, oldName);
      const newItemPath = path.resolve(basePath, newName);
  
      // Check if the old item exists
      if (!fs.existsSync(oldItemPath)) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Item not found' });
      }
  
      // Check if the new item name is valid and does not already exist
      if (fs.existsSync(newItemPath) || !newName) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid or duplicate item name' });
      }
  
      // Rename the item based on its type (directory or file)
      if (itemType === 'directory') {
        fs.renameSync(oldItemPath, newItemPath);
        res.status(httpStatus.OK).json({ message: 'Directory renamed successfully' });
      } else if (itemType === 'file') {
        fs.renameSync(oldItemPath, newItemPath);
        res.status(httpStatus.OK).json({ message: 'File renamed successfully' });
      } else {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid item type' });
      }
    } catch (error) {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to rename item' });
    }
  };
  

const deleteItem = async (req, res) => {
    try {
      // Assuming user ID is available in req.user.id
      const userID = req.user.id;
  
      // Get the folder path and item name from the request body
      const { folderPath, itemName } = req.body;
  
      // Construct the full path to the user's storage directory
      const userStoragePath = path.resolve(`./DropFile/users/${userID}`);
  
      // Determine the base path for deletion (root or folderPath)
      const basePath = folderPath ? path.resolve(userStoragePath, folderPath) : userStoragePath;
  
      // Determine whether to delete a file or a directory based on the provided parameters
      if (itemName) {
        // Delete an item at the specified path
        const itemPath = path.resolve(basePath, itemName);
  
        if (!itemPath.startsWith(userStoragePath)) {
          return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid itemName' });
        }
  
        if (!fs.existsSync(itemPath)) {
          return res.status(httpStatus.NOT_FOUND).json({ message: 'Item not found' });
        }
  
        // Determine whether to delete a file or a directory based on the item type
        const itemStats = fs.statSync(itemPath);
  
        if (itemStats.isDirectory()) {
          fs.rmdirSync(itemPath, { recursive: true });
        } else {
          fs.unlinkSync(itemPath);
        }
      } else {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Missing itemName' });
      }
  
      res.status(httpStatus.OK).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete item' });
    }
  };

  const moveFile = async (req, res) => {
    try {
      // Assuming user ID is available in req.user.id
      const userID = req.user.id;
  
      // Get the current file path and destination path from the request body
      const { currentPath, destinationPath } = req.body;
  
      // Construct the full path to the user's storage directory
      const userStoragePath = path.resolve(`./DropFile/users/${userID}`);
  
      // Construct the full paths to the current file and destination
      const currentFilePath = path.resolve(userStoragePath, currentPath);
      const destinationFilePath = path.resolve(userStoragePath, destinationPath);
  
      // Check if the current file exists
      if (!fs.existsSync(currentFilePath)) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'File not found' });
      }
  
      // Check if the destination directory exists
      if (!fs.existsSync(path.dirname(destinationFilePath))) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Destination directory not found' });
      }
  
      // Move the file to the destination
      fs.renameSync(currentFilePath, destinationFilePath);
  
      res.status(httpStatus.OK).json({ message: 'File moved successfully' });
    } catch (error) {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to move file' });
    }
  };

const createDirectory = async (req, res) => {
    try {
      // Assuming user ID is available in req.user.id
      const userID = req.user.id;
  
      // Get the folder path and directory name from the request body
      const { folderPath, directoryName } = req.body;
  
      // Construct the full path to the user's storage directory
      const userStoragePath = path.resolve(`./DropFile/users/${userID}`);
  
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
  
      // Create the new directory inside the requested folder
      const newDirectoryPath = path.resolve(requestedFolderPath, directoryName);
      fs.mkdirSync(newDirectoryPath);
  
      res.status(httpStatus.CREATED).json({ message: 'Directory created successfully' });
    } catch (error) {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create directory' });
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
    list,
    createDirectory,
    deleteItem,rename,
    moveFile
};