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

        res.status(200).json({ message: 'File uploaded successfully for user' +userID + req.file });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'File upload failed for user ' + req.user.id });
    }
};

module.exports = {
    upload
};