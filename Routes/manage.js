const express = require("express");
const router = express.Router();

const { list } = require("../Controllers/manage");

router.get("/booking/manage", list);

module.exports = router;
