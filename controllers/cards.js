const Card = require('../models/card');
const { BAD_REQUEST_CODE, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Некорректные данные при создании карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка Сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const error = new Error('Неверный id карточки');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Неверный формат id' });
      } else if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка Сервера' });
      }
    });
};

const likeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true })
    .orFail(() => {
      const error = new Error('Карточки с таким id нет');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Карточки с таким id нет' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Неверный данные запроса' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

const disLikeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: owner } }, { new: true })
    .orFail(() => {
      const error = new Error('Карточки с таким id нет');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Карточки с таким id нет' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Неверный данные запроса' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};