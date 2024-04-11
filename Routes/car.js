const express = require('express');
const router = express.Router();

const {list, create, remove} = require('../Controllers/car');

router.get('/setting/car', list);
router.post('/setting/car/Add', create);
router.delete('/setting/car/Delete/:id', remove);

module.exports = router;
