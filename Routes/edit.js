const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {list} = require('../Controllers/edit');

router.get('/profile/edit', auth, list);

module.exports = router;
