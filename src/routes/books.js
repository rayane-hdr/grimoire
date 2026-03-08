const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp");
const booksCtrl = require("../controllers/books");

/* ============================
   📖 READ (PUBLIC)
   ============================ */

// ✅ Liste de tous les livres (PUBLIC)
router.get("/", booksCtrl.getAllBooks);

// ✅ Meilleurs livres (PUBLIC)
router.get("/bestrating", booksCtrl.getBestRatedBooks);

// ✅ Détail d’un livre (PUBLIC)
router.get("/:id", booksCtrl.getOneBook);


/* ============================
   ✍️ CREATE (PROTÉGÉ)
   ============================ */

// 🔒 Création d’un livre
router.post("/", auth, multer, sharp, booksCtrl.createBook);

// 🔒 Noter un livre
router.post("/:id/rating", auth, booksCtrl.rateBook);


/* ============================
   ✏️ UPDATE (PROTÉGÉ)
   ============================ */

// 🔒 Modifier un livre
router.put("/:id", auth, multer, sharp, booksCtrl.modifyBook);


/* ============================
   🗑 DELETE (PROTÉGÉ)
   ============================ */

// 🔒 Supprimer un livre
router.delete("/:id", auth, booksCtrl.deleteBook);


module.exports = router;