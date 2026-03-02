const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);

    // Sécurité : on ignore tout userId envoyé par le client
    delete bookObject.userId;
    delete bookObject._id;

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      ratings: [],
      averageRating: 0,
    });

    book.save()
      .then(() => res.status(201).json({ message: "Livre enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    return res.status(400).json({ error: "Invalid book JSON" });
  }
};
// ✅ GET /api/books
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// ✅ GET /api/books/:id
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) return res.status(404).json({ message: "Livre introuvable" });
      return res.status(200).json(book);
    })
    .catch((error) => res.status(400).json({ error }));
};

// ✅ GET /api/books/bestrating  (top 3)
exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = (req, res, next) => {
  const userId = req.auth.userId;
  const grade = req.body.rating;

  if (grade < 0 || grade > 5) {
    return res.status(400).json({ message: "La note doit être entre 0 et 5" });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre introuvable" });
      }

      // Vérifie si l'utilisateur a déjà noté
      const alreadyRated = book.ratings.find(r => r.userId === userId);
      if (alreadyRated) {
        return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
      }

      // Ajouter la note
      book.ratings.push({ userId, grade });

      // Recalcul averageRating
      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = total / book.ratings.length;

      return book.save();
    })
    .then((updatedBook) => res.status(200).json(updatedBook))
    .catch((error) => res.status(400).json({ error }));
};