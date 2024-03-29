const express = require("express");
const router = express.Router();

const { list } = require("../Controllers/booking");

router.get("/booking", list);

module.exports = router;
