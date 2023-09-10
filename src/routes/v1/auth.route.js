const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: File Upload
 *   description: File Upload
 */

/**
 * @swagger
 * /dropfile/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [File Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: File uploaded successfully
 *       "400":
 *         description: Bad request
 *       "500":
 *         description: Internal server error
 */

/**
 * @swagger
 * /dropfile/delete:
 *   delete:
 *     summary: Delete a file or directory
 *     tags: [File Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folderPath:
 *                 type: string
 *                 description: The path to the folder containing the item to be deleted. Leave empty for the root directory.
 *               itemName:
 *                 type: string
 *                 description: The name of the file or directory to be deleted.
 *             example:
 *               folderPath: "my-folder"
 *               itemName: "folder"
 *     responses:
 *       "200":
 *         description: Item deleted successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Item not found
 *       "500":
 *         description: Internal server error
 */

/**
 * @swagger
 * /dropfile/rename:
 *   put:
 *     summary: Rename a file or directory
 *     tags: [File Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folderPath:
 *                 type: string
 *                 description: The path to the folder containing the item to be renamed. Leave empty for the root directory.
 *               oldName:
 *                 type: string
 *                 description: The current name of the file or directory.
 *               newName:
 *                 type: string
 *                 description: The new name for the file or directory.
 *               itemType:
 *                 type: string
 *                 enum: [directory, file]
 *                 description: The type of the item to be renamed (directory or file).
 *             example:
 *               folderPath: "my-folder"
 *               oldName: "old-name.txt"
 *               newName: "new-name.txt"
 *               itemType: "file"
 *     responses:
 *       "200":
 *         description: Item renamed successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Item not found
 *       "500":
 *         description: Internal server error
 */

/**
 * @swagger
 * /dropfile/move:
 *   put:
 *     summary: Move a file to a new location
 *     tags: [File Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPath:
 *                 type: string
 *                 description: The current path of the file to be moved.
 *               destinationPath:
 *                 type: string
 *                 description: The destination path where the file will be moved.
 *             example:
 *               currentPath: "folder/file.txt"
 *               destinationPath: "new-folder/file.txt"
 *     responses:
 *       "200":
 *         description: File moved successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: File or destination directory not found
 *       "500":
 *         description: Internal server error
 */

/**
 * @swagger
 * /dropfile/list:
 *   get:
 *     summary: List files and directories
 *     tags: [File Upload]
 *     parameters:
 *       - in: query
 *         name: folderPath
 *         schema:
 *           type: string
 *         description: The path to the folder whose content should be listed. Leave empty for the root directory.
 *       - in: query
 *         name: showStructure
 *         schema:
 *           type: boolean
 *         description: Set to true to return the entire directory structure; false to return only the content of the specified path.
 *     responses:
 *       "200":
 *         description: File and directory listing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 structure:
 *                   type: array
 *                   description: The directory structure (if showStructure is true) or the content of the specified path.
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Folder not found
 *       "500":
 *         description: Internal server error
 */

/**
 * @swagger
 * /dropfile/create-directory:
 *   post:
 *     summary: Create a new directory
 *     tags: [File Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folderPath:
 *                 type: string
 *                 description: The path to the folder where the new directory should be created. Leave empty for the root directory.
 *               directoryName:
 *                 type: string
 *                 description: The name of the new directory to be created.
 *             example:
 *               folderPath: "my-folder"
 *               directoryName: "new-directory"
 *     responses:
 *       "201":
 *         description: Directory created successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Folder not found
 *       "500":
 *         description: Internal server error
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: password1
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */

/**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: An email will be sent to verify email.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: verify email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify email token
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: verify email failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: verify email failed
 */
