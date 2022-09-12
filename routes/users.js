const router = require('express').Router();
const { getUsers, getCurrentUser, createUser } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getCurrentUser);

router.post('/users', createUser);

module.exports = router;