const express = require("express");
const router = express.Router();
const {
  getAllCrypto,
  getTopGainers,
  getNewListings,
  createCrypto,
} = require("../controllers/cryptoController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/crypto", getAllCrypto);
router.get("/crypto/gainers", getTopGainers);
router.get("/crypto/new", getNewListings);
router.post("/crypto", authMiddleware, createCrypto);

module.exports = router;