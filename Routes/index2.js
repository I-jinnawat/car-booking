const express = require("express");
const router = express.Router();

const { read, list, creat, update, remove } = require("../Controllers/index2");

router.get("/page/index2", list);

module.exports = router;
