const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);

    delete bookObject.userId;
    delete bookObject._id;

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      ratings: bookObject.ratings || [],
      averageRating: bookObject.averageRating || 0,
    });

    book.save()
      .then(() => res.status(201).json({ message: "Livre enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    return res.status(400).json({ error: "Invalid book JSON" });
  }
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) return res.status(404).json({ message: "Livre introuvable" });
      return res.status(200).json(book);
    })
    .catch((error) => res.status(400).json({ error }));
};

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

      const alreadyRated = book.ratings.find((r) => r.userId === userId);
      if (alreadyRated) {
        return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
      }

      book.ratings.push({ userId, grade });

      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = total / book.ratings.length;

      return book.save();
    })
    .then((updatedBook) => res.status(200).json(updatedBook))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre introuvable" });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Non autorisé" });
      }

      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.error("Image delete error:", err);
        }

        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) return res.status(404).json({ message: "Livre introuvable" });

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Non autorisé" });
      }

      let updatedBook;

      if (req.file) {
        const bookObject = JSON.parse(req.body.book);
        delete bookObject.userId;
        delete bookObject._id;

        updatedBook = {
          ...bookObject,
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        };

        const oldFilename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${oldFilename}`, (err) => {
          if (err) console.error("Old image delete error:", err);
        });
      } else {
        const bookObject = { ...req.body };
        delete bookObject.userId;
        delete bookObject._id;

        updatedBook = { ...bookObject };
      }

      return Book.updateOne(
        { _id: req.params.id },
        { ...updatedBook, _id: req.params.id }
      );
    })
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};