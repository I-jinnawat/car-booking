const express = require('express');
const router = express.Router();
const {read} = require('../Controllers/dashboard');
router.get('/', read);

module.exports = router;
