const express = require("express");
const router = express.Router();

const { list } = require("../Controllers/profile");

router.get("/profile/:id", list);

module.exports = router;
