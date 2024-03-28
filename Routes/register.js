const express = require("express");
const router = express.Router();

const { list, login, create } = require("../Controllers/register");

router.post("/register", create);
router.get("/register", list);

module.exports = router;
