const express = require("express");
const router = express.Router();

const { read, list, creat, update, remove } = require("../Controllers/index");

router.get("/page/index1", list);
router.get("/", read);
router.post("/", creat);

module.exports = router;
