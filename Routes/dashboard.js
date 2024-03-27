const express = require("express");
const router = express.Router();

const {
  read,
  list,
  creat,
  update,
  remove,
} = require("../Controllers/dashboard");

router.get("/", read);

module.exports = router;
