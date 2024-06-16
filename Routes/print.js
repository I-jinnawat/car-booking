const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {list} = require('../Controllers/print');

router.get('/print/:id', auth, list);

module.exports = router;
