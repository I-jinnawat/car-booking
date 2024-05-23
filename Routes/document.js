const express = require('express');
const router = express.Router();
const upload = require('../Config/multer');
const auth = require('../middleware/auth');

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
router.get('/document/add', auth, display_add_page);
router.get('/document/edit/:id', auth, display_edit_page);
router.get('/document/search/:category', read);
router.post(
  '/document/add',
  auth,
  upload.fields([
    {name: 'link', maxCount: 1},
    {name: 'image', maxCount: 1},
  ]),
  create
);
router.post(
  '/document/edit/:id',
  auth,
  upload.fields([
    {name: 'link', maxCount: 1},
    {name: 'image', maxCount: 1},
  ]),
  update
);
router.delete('/document/delete/:id', auth, remove);

module.exports = router;
