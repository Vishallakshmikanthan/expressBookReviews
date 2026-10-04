const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1 & Task 10: Get the book list available in the shop using Promise callbacks or async-await with Axios
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks
    .then((bookList) => res.status(200).json(bookList))
    .catch((err) => res.status(500).json({ message: "Error retrieving books" }));
});

// Task 2 & Task 11: Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBN
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 3 & Task 12: Get book details based on author using Promise callbacks or async-await with Axios
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const result = {};
    for (const isbn in books) {
      if (books[isbn].author.toLowerCase() === author) {
        result[isbn] = books[isbn];
      }
    }
    if (Object.keys(result).length > 0) {
      resolve(result);
    } else {
      reject({ status: 404, message: "No books found" });
    }
  });

  getBooksByAuthor
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 4 & Task 13: Get all books based on title using Promise callbacks or async-await with Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const getBooksByTitle = new Promise((resolve, reject) => {
    const result = {};
    for (const isbn in books) {
      if (books[isbn].title.toLowerCase() === title) {
        result[isbn] = books[isbn];
      }
    }
    if (Object.keys(result).length > 0) {
      resolve(result);
    } else {
      reject({ status: 404, message: "No books found" });
    }
  });

  getBooksByTitle
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

// =========================================================================
// Tasks 10-13: Asynchronous helper functions using async/await with Axios
// =========================================================================

// Task 10: Get all books using async/await with Axios
const getBooksAsync = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 11: Get book details by ISBN using async/await with Axios
const getBookByISBNAsync = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 12: Get book details by Author using async/await with Axios
const getBooksByAuthorAsync = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 13: Get book details by Title using async/await with Axios
const getBooksByTitleAsync = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports.general = public_users;
module.exports.getBooksAsync = getBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
