const express = require("express");
const router = express.Router();

const { read, list, creat, update, remove } = require("../Controllers/profile");

router.get("/profile", read);

module.exports = router;
