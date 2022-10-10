const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { createUser, login } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { isAuthorized } = require('./middlewares/auth');
const { validateUser, validateAuthorization } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', isAuthorized, userRouter);
app.use('/cards', isAuthorized, cardRouter);

app.post('/signup', validateUser, createUser);
app.post('/signin', validateAuthorization, login);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use(errors());

// eslint-disable-next-line consistent-return
app.use((err, req, res) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);