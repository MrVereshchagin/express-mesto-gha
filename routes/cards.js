const router = require('express').Router();

const { validateCardId, validateCreateCard } = require('../middlewares/validation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  disLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', validateCreateCard, createCard);

router.delete('/:cardId', validateCardId, deleteCard);

router.put('/:cardId/likes', validateCardId, likeCard);

router.delete('/:cardId/likes', validateCardId, disLikeCard);

module.exports = router;