const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const path = require('path');
const fs = require('fs');


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
  
      // Construct the user's storage path
      const userStoragePath = `./DropFile/users/${userID}`;
  
      // Check if the user's storage directory exists
      if (!fs.existsSync(userStoragePath)) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'User storage not found' });
      }
  
      // List files in the user's storage directory
      const files = fs.readdirSync(userStoragePath);
  
      res.status(httpStatus.OK).json({ files });
    } catch (error) {
      console.error(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to list files' });
    }
  };

module.exports = {
    upload,
    list
};