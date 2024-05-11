const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {list, update, create, read} = require('../Controllers/user');

router.post('/user', auth, create);
router.get('/user', auth, list);
router.get('/user/:id', auth, read);
router.post('/user/update/:id', auth, update);
// router.delete("/user:id", remove);
module.exports = router;
