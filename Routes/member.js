const express = require('express');
const router = express.Router();

const {read, list} = require('../Controllers/member');

router.get('/setting/member', read);
router.get('/member', list);

module.exports = router;
