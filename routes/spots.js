const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const Spot = require('../models/spot');
const { isLoggedIn, isAuthor, validateSpot } = require('../middleware.js');

router.get('/', wrapAsync(async (req, res) => {
    const spots = await Spot.find({});
    res.render('spots/index', { spots });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('spots/new');
});
router.post('/', isLoggedIn, validateSpot, wrapAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot);
    spot.author = req.user._id;
    await spot.save();
    req.flash('success', 'Spot successfully created!');
    res.redirect(`/spots/${spot._id}`);   
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id).populate({
        path: 'comments',
        populate: { path: 'author' }
    }).populate('author');
    if(!spot) {
        req.flash('error', 'Cannot find spot.');
        return res.redirect('/spots');
    }
    res.render('spots/details', { spot });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    if(!spot) {
        req.flash('error', 'Cannot find spot.');
        return res.redirect('/spots');
    }
    res.render('spots/edit', { spot });
}));
router.put('/:id', isLoggedIn, isAuthor, validateSpot, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    req.flash('success', 'Spot successfully updated!');
    res.redirect(`/spots/${spot._id}`);
}));

router.get('/:id/delete', isLoggedIn, wrapAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/delete', { spot });
}));
router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id); //the findByIdAndDelete function triggers the findOneAndDelete middleware
    req.flash('success', 'Spot successfully deleted!');
    res.redirect('/spots');
}));

module.exports = router;