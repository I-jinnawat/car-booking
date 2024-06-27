const express = require('express');
const router = express.Router();
const {upload} = require('../Config/multer');
const auth = require('../middleware/auth');
const {list, update, create} = require('../Controllers/edit-manual');

router.get('/setting/edit-manual', auth, list);
router.post(
  '/setting/edit-manual/:id',
  auth,
  upload.fields([{name: 'attachment', maxCount: 1}]),
  update
);
router.post(
  '/setting/edit-manual',
  upload.fields([{name: 'attachment', maxCount: 1}]),
  create
);

module.exports = router;
