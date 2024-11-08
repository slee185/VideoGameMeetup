const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.get('/', controller.index);

//GET /users/new: send html form for creating a new user
router.get('/new', controller.new);

//GET profile
router.get('/profile', controller.profile);

//POST /users: create a new user
router.post('/', controller.create);

// POST login submission
// router.post('/login', controller.processLogin);

// GET login submission
router.get('/login', controller.login);

// GET logout request
router.get('/logout', controller.logout);

//GET /users/:id: send details of user identified by id
// router.get('/:id', controller.show);

//GET /users/:id/edit: send html form for editing an exising user
router.get('/:id/edit', controller.edit);

//PUT /users/:id: update the user identified by id
router.put('/:id', controller.update);

//DELETE /users/:id, delete the user identified by id
router.delete('/:id', controller.delete);

module.exports = router;