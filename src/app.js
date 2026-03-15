require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes 
const authRouter      = require('./modules/auth/Auth.router');
// const booksRouter     = require('./modules/books/books.router');
// const borrowersRouter = require('./modules/borrowers/borrowers.router');
// const borrowingRouter = require('./modules/borrowing/borrowing.router');

app.use('/api/auth',      authRouter);
// app.use('/api/books',     booksRouter);
// app.use('/api/borrowers', borrowersRouter);
// app.use('/api/borrowing', borrowingRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start Server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;