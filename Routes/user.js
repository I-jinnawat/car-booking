const express = require('express');
const router = express.Router();

const {list, update, create, read} = require('../Controllers/user');

router.post('/user', create);
router.get('/user', list);
router.get('/user/:id', read);
router.post('/user/:id', update);
// router.delete("/user:id", remove);
module.exports = router;
