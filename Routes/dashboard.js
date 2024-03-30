const express = require("express");
const router = express.Router();

const { read, list } = require("../Controllers/dashboard");

router.post("/", read);
router.get("/", read);

module.exports = router;
