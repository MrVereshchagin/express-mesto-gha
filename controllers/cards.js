const Card = require('../models/card');

const BadRequest = require('../errors/error400');
const Forbidden = require('../errors/error403');
const NotFound = require('../errors/error404');
const ServerError = require('../errors/error500');

const { ok, created } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(created).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Некорректные данные при создании карточки' });
      } else {
        next(new ServerError('Что-то пошло не так'));
      }
    });
};
// Посмотреть проверку собственника карточки
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка с таким id не найдена'));
        return;
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        next(new Forbidden('Нельзя удалить эту карточку'));
        return;
      }
      card.remove()
        .then(() => {
          res.status(ok).send({ message: 'Карточка успешно удалена' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный формат id'));
      } else {
        next(new ServerError('Ошибка Сервера'));
      }
    });
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true })
    .orFail(() => new NotFound('Карточки с таким id нет'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Невалидный идентификатор карточки.'));
      } else {
        next(err);
      }
    });
};

const disLikeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: owner } }, { new: true })
    .orFail(() => new NotFound('Карточки с таким id нет'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Невалидный идентификатор карточки.'));
      } else {
        next(err);
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