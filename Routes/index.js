const express = require("express");
const router = express.Router();

const { read, list, creat, update, remove } = require("../Controllers/index");

router.get("/", list);
router.post("/", creat);

module.exports = router;
