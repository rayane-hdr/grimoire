const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const booksCtrl = require("../controllers/books");

// ✅ READ
router.get("/", auth, booksCtrl.getAllBooks);
router.get("/bestrating", auth, booksCtrl.getBestRatedBooks);
router.get("/:id", auth, booksCtrl.getOneBook);

// ✅ CREATE
router.post("/", auth, multer, booksCtrl.createBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);

// ✅ DELETE
router.delete("/:id", auth, booksCtrl.deleteBook);

// ✅ UPDATE
router.put("/:id", auth, multer, booksCtrl.modifyBook); 

module.exports = router;