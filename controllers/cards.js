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
  const { name, link, likes } = req.body;
  const { owner } = req.user._id;
  Card.create({
    name,
    link,
    owner,
    likes,
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      res.send({ message: err });
    });
  console.log(req.user._id); // _id станет доступен
};

const deleteCard = (req, res) => {
  const { cardId } = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      card.remove();
    })
    .catch((err) => {
      res.send({ message: err });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};