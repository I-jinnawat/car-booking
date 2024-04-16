const express = require('express');
const router = express.Router();

const {list, change_PSW} = require('../Controllers/profile');

router.get('/profile/:id', list);
router.get('/profile/Change_PSW/:id', change_PSW);

module.exports = router;
