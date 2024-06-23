const express = require('express');
const router = express.Router();

const {list, check} = require('../Controllers/forgot_PSW');

router.get('/forgot_PSW', list);
router.get('/forgot_PSW/change_PSW', check);
module.exports = router;
