const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

  try {
     // Assume the endpoint to get all books
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
  // return res.status(200).json(JSON.stringify(books, null, 4));
  const books_db = await JSON.stringify(books, null, 4);
  return res.status(200).json(books_db);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    const bookISBN = await books[isbn];
    return res.status(200).json(bookISBN);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author.toLowerCase();
  const filteredBooks = await Object.values(books).filter(book => book.author.toLowerCase() === author);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "Books not found for the given author" });
  }

  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title.toLowerCase();
  const filteredBooks = await Object.values(books).filter(book => book.title.toLowerCase() === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "Books not found for the given title" });
  }

  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews)
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
