const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {list, change_PSW} = require('../Controllers/profile');

router.get('/profile/:id', auth, list);
router.get('/profile/Change_PSW/:id', auth, change_PSW);

module.exports = router;
