require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet  = require('helmet');
const hpp                = require('hpp');
const { generalLimiter } = require('./middlewares/rateLimiter.middleware');
const app = express();

app.use(cors());
app.use(helmet());
app.use(generalLimiter);
// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(hpp());

// Routes 
const authRouter      = require('./modules/auth/auth.router');
const booksRouter     = require('./modules/books/books.router');
const borrowersRouter = require('./modules/borrowers/borrowers.router');
const borrowingRouter = require('./modules/borrowing/borrowing.router');

app.use('/api/auth',      authRouter);
app.use('/api/books',     booksRouter);
app.use('/api/borrowers', borrowersRouter);
app.use('/api/borrowing', borrowingRouter);

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