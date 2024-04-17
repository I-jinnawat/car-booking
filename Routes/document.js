const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const {list, create, read} = require('../Controllers/document');

router.get('/document', list);
router.get('/document/search/:category', read);
router.post('/document/add', upload.single('image'), create);

module.exports = router;
