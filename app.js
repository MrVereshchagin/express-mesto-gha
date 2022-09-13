const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
// const { createCard, deleteCard } = require('./controllers/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6320cab94d4ddf02e6e101cf', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

// app.use('/cards', createCard);
//
// app.use('/:userId', deleteCard);

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log(`App listening on port ${PORT}`);
});

app.listen(PORT);