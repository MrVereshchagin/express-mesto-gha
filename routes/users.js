const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  getCurrentUserProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getCurrentUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

router.get('/me', getCurrentUserProfile);

module.exports = router;