const express = require("express");
const router = express.Router();

const { logout } = require("../Controllers/logout");

router.post("/logout", logout);

module.exports = router;
