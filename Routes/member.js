const express = require("express");
const router = express.Router();

const { list } = require("../Controllers/member");

router.get("/setting/member", list);

module.exports = router;
