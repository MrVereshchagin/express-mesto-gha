const router = require('express').Router();

const { validateCurrentUser, validatePatchUserProfile, validatepatchAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  getCurrentUserProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.patch('/me', validatePatchUserProfile, updateProfile);

router.patch('/me/avatar', validatepatchAvatar, updateAvatar);

router.get('/me', getCurrentUserProfile);

router.get('/:userId', validateCurrentUser, getCurrentUser);

module.exports = router;