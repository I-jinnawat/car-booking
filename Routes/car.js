const express = require("express");
const router = express.Router();

const { list, create } = require("../Controllers/car");

router.get("/setting/car", list);
router.post("/setting/car/Add", create);

module.exports = router;
