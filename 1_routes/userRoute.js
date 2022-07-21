const express = require('express');
const router = express.Router();
const userController = require('../2_controllers/userController');

router.post('/signup', userController.signup);

module.exports = router;