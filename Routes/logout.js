const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {logout} = require('../Controllers/logout');

router.post('/logout', auth, logout);

module.exports = router;
