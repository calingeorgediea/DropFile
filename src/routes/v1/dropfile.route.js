const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const fileController = require('../../controllers/file.controller');
const router = express.Router();
const authValidation = require('../../validations/auth.validation');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to generate destination folder dynamically based on user ID
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Assuming user ID is available in req.user.id
      const userID = req.user.id;
      const userStoragePath = path.join('DropFile', 'users', userID);
  
      // Create the user's folder if it doesn't exist
      if (!fs.existsSync(userStoragePath)) {
        fs.mkdirSync(userStoragePath, { recursive: true });
      }
  
      // Set the destination path to the user's folder
      cb(null, userStoragePath);
    },
    filename: (req, file, cb) => {
      // Use the original filename provided by the client
      const originalFilename = file.originalname;
      cb(null, originalFilename);
    },
  });

const upload = multer({ storage });

// Define a route for file uploads
// Protect the route with authentication middleware
router.post('/upload', auth(), upload.single('file'), fileController.upload);


module.exports = router;
