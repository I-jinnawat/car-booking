const express = require('express');
const router = express.Router();
const unlockBooking = require('../middleware/unlockBooking');
const {list} = require('../Controllers/manage');

router.get('/manage', unlockBooking, list);

module.exports = router;
