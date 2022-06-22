const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const spots = require('../controllers/spots');
const Spot = require('../models/spot');
const { isLoggedIn, isAuthor, validateSpot } = require('../middleware.js');

router.get('/', wrapAsync(spots.index));

router.get('/new', isLoggedIn, spots.renderNewForm);
router.post('/', isLoggedIn, validateSpot, wrapAsync(spots.createSpot));

router.get('/:id', wrapAsync(spots.showSpot));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(spots.renderEditForm));
router.put('/:id', isLoggedIn, isAuthor, validateSpot, wrapAsync(spots.updateSpot));

router.get('/:id/delete', isLoggedIn, wrapAsync(spots.renderDeleteForm));
router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(spots.deleteSpot));

module.exports = router;