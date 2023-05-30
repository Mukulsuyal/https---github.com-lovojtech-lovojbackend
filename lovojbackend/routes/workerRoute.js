const express = require('express');
const router = express.Router();
const { roleSignUp } = require('../controllers/workerController');
const { jwtAuth } = require('../middleware/jwtAuth');

// POST route for manager sign up
//Api Endpoint /designation/
router.post('/signup',jwtAuth, roleSignUp);
// router.post('/login', roleLogin);

module.exports = router;