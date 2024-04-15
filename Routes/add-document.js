const express = require('express');
const router = express.Router();

const {list} = require('../Controllers/add-document');

router.get('/document/add', list);

module.exports = router;
