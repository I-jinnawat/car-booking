const express = require('express');
const router = express.Router();

const {list} = require('../Controllers/print');

router.get('/print/:id', list);

module.exports = router;
