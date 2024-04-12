const express = require('express');
const router = express.Router();

const {read, list, update, remove} = require('../Controllers/member');

router.get('/setting/member', read);
router.get('/member', list);
router.post('/setting/member/update/:id', update);
router.delete('/setting/member/delete/:id', remove);

module.exports = router;
