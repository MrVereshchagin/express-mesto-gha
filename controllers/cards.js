const Card = require('../models/card');

const BAD_REQUEST_CODE = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user._id);
  const { owner } = req.user._id;
  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'badRequest') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка Сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  console.log(cardId);
  Card.findById(cardId)
    .then((card) => {
      card.remove();
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
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
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
    });
};

const disLikeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
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