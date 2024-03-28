const express = require("express");
const router = express.Router();

const { list, login } = require("../Controllers/login");

router.get("/login", list);
router.post("/login", login);

module.exports = router;
