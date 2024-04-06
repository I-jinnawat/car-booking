const express = require("express");
const router = express.Router();

const { list } = require("../Controllers/document");

router.get("/document/form", list);

module.exports = router;
