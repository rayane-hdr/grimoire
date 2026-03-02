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