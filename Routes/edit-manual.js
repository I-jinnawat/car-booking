const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {list} = require('../Controllers/edit-manual');

router.get('/setting/edit-manual', auth, list);

module.exports = router;
