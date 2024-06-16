const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {read, list, update, remove} = require('../Controllers/member');

router.get('/setting/member', auth, read);
router.get('/member', list);
router.post('/setting/member/update/:id', auth, update);
router.delete('/setting/member/delete/:id', remove);

module.exports = router;
