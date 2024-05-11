const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {list, create, update, remove} = require('../Controllers/car');

router.get('/setting/car', auth, list);
router.post('/setting/car/Add', auth, create);
router.post('/setting/car/Update/:id', auth, update);
router.delete('/setting/car/Delete/:id', auth, remove);

module.exports = router;
