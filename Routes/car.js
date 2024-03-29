const express = require("express");
const router = express.Router();

const { list } = require("../Controllers/car");

router.get("/setting/car", list);

module.exports = router;
