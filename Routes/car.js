const express = require('express');
const router = express.Router();

const {list, create, update, remove} = require('../Controllers/car');

router.get('/setting/car', list);
router.post('/setting/car/Add', create);
router.post('/setting/car/Update/:id', update);
router.delete('/setting/car/Delete/:id', remove);

module.exports = router;
