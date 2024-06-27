const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {API_member, list, update, remove} = require('../Controllers/member');

router.get('/setting/member', auth, list);
router.get('/member', auth, API_member);
router.post('/setting/member/update/:id', auth, update);
router.delete('/setting/member/delete/:id', remove);

module.exports = router;
