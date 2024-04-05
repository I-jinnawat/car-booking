const express = require("express");
const router = express.Router();

const { list } = require("../Controllers/manage");

router.get("/manage", list);

module.exports = router;
