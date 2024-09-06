const express = require('express');const router = express.Router();
const {read} = require('../Controllers/dashboard');
const Auth = require('../middleware/auth');
router.get('/dashboard', Auth, read);

module.exports = router;
