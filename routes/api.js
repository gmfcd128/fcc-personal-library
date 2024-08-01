/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();

// Connect to MongoDB using the connection string from the .env file
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

// Define the book schema
const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {
  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find();
        const response = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));
        res.json(response);
      } catch (err) {
        res.status(500).send('Error fetching books');
      }
    })
    
    .post(async function (req, res) {
      const title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }
      try {
        const newBook = new Book({ title, comments: [] });
        await newBook.save();
        res.json({ _id: newBook._id, title: newBook.title });
      } catch (err) {
        res.status(500).send('Error saving book');
      }
    })
    
    .delete(async function(req, res) {
      try {
        await Book.deleteMany();
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('Error deleting books');
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      const bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        res.status(500).send('Error fetching book');
      }
    })
    
    .post(async function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      if (!comment) {
        return res.send('missing required field comment');
      }
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        book.comments.push(comment);
        await book.save();
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        res.status(500).send('Error adding comment');
      }
    })
    
    .delete(async function (req, res) {
      const bookid = req.params.id;
      try {
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch (err) {
        res.status(500).send('Error deleting book');
      }
    });

};
