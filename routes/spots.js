const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const spots = require('../controllers/spots');
const Spot = require('../models/spot');
const { isLoggedIn, isAuthor, validateSpot } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', wrapAsync(spots.index));

router.get('/new', isLoggedIn, spots.renderNewForm);
router.post('/', isLoggedIn, upload.array('image'), validateSpot, wrapAsync(spots.createSpot)); 
//multer first uploads the image and then adds the data onto req.body

router.get('/:id', wrapAsync(spots.showSpot));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(spots.renderEditForm));
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateSpot, wrapAsync(spots.updateSpot));

router.get('/:id/delete', isLoggedIn, wrapAsync(spots.renderDeleteForm));
router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(spots.deleteSpot));

module.exports = router;