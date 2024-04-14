const express = require('express');
const router = express.Router();

const {list, create, read} = require('../Controllers/document');

router.get('/document', list);
router.get('/document/:category', read);
router.post('/document/create', create);

module.exports = router;
