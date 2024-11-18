const express = require('express');
const controller = require('../controllers/eventController');
const {isLoggedIn, isHost} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');

const router = express.Router();

// GET: Send all events to user
router.get('/',controller.index);

// GET: Send html form for creating new event
router.get('/new', isLoggedIn, controller.new);

// POST: Create a new event
router.post('/', isLoggedIn, controller.create);

// GET: Send details of event identified by id
router.get('/:id', validateId, controller.show); 

// GET: Send html form for editing an existing event
router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit); 

// PUT: Update the event identified by id
router.put('/:id', validateId, isLoggedIn, isHost, controller.update);

// DELETE: Delete the event identified by id
router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);

module.exports = router;