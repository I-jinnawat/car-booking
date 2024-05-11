const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {list} = require('../Controllers/manage');

router.get('/manage', auth, list);

module.exports = router;
