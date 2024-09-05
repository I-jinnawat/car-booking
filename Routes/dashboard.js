const express = require('express');const router = express.Router();
const {read} = require('../Controllers/dashboard');
router.get('/dashboard', read);

module.exports = router;
