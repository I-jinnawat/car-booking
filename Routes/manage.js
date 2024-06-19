const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {list, search} = require('../Controllers/manage');

router.get('/manage', auth, list);
router.get('/manage/search', search);

module.exports = router;
