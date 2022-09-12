const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const { createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use('/users', userRouter);

app.use('/userId', userRouter);

app.use('/users', createUser);

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log(`App listening on port ${PORT}`);
});

app.listen(PORT);