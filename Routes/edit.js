const express = require("express");
const router = express.Router();

const { list } = require("../Controllers/edit");

router.get("/profile/edit", list);

module.exports = router;
