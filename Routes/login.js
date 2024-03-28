const express = require("express");
const router = express.Router();

const { read, list, creat, update, remove } = require("../Controllers/login");

router.get("/login", read);
router.post("/login", read);

module.exports = router;
