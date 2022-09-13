const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  createUser,
  updateProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getCurrentUser);

router.post('/', createUser);

router.patch('/me', updateProfile);

module.exports = router;