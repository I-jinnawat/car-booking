const express = require("express");
const router = express.Router();

const { read, list, creat, update, remove } = require("../Controllers/product");

router.get("/product/:id", read);
router.get("/product", list);
router.post("/product", creat);
router.put("/product/:id", update);
router.delete("/product/:id", remove);

module.exports = router;
