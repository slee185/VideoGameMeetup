const express = require('express');
const controller = require('../controllers/eventController');
const {isLoggedIn, isHost} = require('../middleware/auth');

const router = express.Router();

// GET: Send all events to user
router.get('/',controller.index);

// GET: Send html form for creating new event
router.get('/new', isLoggedIn, controller.new);

// POST: Create a new event
router.post('/', isLoggedIn, controller.create);

// GET: Send details of event identified by id
router.get('/:id', controller.show); 

// GET: Send html form for editing an existing event
router.get('/:id/edit', isLoggedIn, isHost, controller.edit); 

// PUT: Update the event identified by id
router.put('/:id', isLoggedIn, isHost, controller.update);

// DELETE: Delete the event identified by id
router.delete('/:id', isLoggedIn, isHost, controller.delete);

module.exports = router;