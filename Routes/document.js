const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const {
  list,
  create,
  read,
  display_add_page,
  display_edit_page,
  update,
  remove,
} = require('../Controllers/document');

router.get('/document', list);
router.get('/document/add', display_add_page);
router.get('/document/edit/:id', display_edit_page);
router.get('/document/search/:category', read);
router.post('/document/add', upload.single('image'), create);
router.post('/document/edit/:id', update);
router.delete('/document/delete/:id', remove);

module.exports = router;
