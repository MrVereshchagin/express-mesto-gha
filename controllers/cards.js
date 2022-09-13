const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.send({ message: err });
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
      res.send({ message: err });
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
      res.send({ message: err });
    });
};

const likeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      res.send({ message: err });
    });
};

const disLikeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: owner } })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      res.send({ message: err });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
};