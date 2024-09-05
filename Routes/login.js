const express = require('express');const router = express.Router();
const redirectIfAuth = require('../middleware/redirectIfAuth');

const {list, login} = require('../Controllers/login');

router.get('/', redirectIfAuth, list);
router.post('/login', redirectIfAuth, login);

module.exports = router;
