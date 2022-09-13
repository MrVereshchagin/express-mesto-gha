const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);

module.exports = router;