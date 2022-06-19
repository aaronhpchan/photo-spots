const express = require('express');
const router = express.Router();
const { spotSchema } = require('../schemas.js');
const wrapAsync = require('../utilities/wrapAsync');
const ExpressError = require('../utilities/ExpressError');
const Spot = require('../models/spot');

const validateSpot = (req, res, next) => {   
    const { error } = spotSchema.validate(req.body);
    if(error) {
        const errorMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(errorMsg, 400);
    } else {
        next();
    }
};

router.get('/', wrapAsync(async (req, res) => {
    const spots = await Spot.find({});
    res.render('spots/index', { spots });
}));

router.get('/new', (req, res) => {
    res.render('spots/new');
});
router.post('/', validateSpot, wrapAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot);
    await spot.save();
    req.flash('success', 'Spot successfully created!');
    res.redirect(`/spots/${spot._id}`);   
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id).populate('comments');
    if(!spot) {
        req.flash('error', 'Cannot find spot.');
        return res.redirect('/spots');
    }
    res.render('spots/details', { spot });
}));

router.get('/:id/edit', wrapAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    if(!spot) {
        req.flash('error', 'Cannot find spot.');
        return res.redirect('/spots');
    }
    res.render('spots/edit', { spot });
}));
router.put('/:id', validateSpot, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    req.flash('success', 'Spot successfully updated!');
    res.redirect(`/spots/${spot._id}`);
}));

router.get('/:id/delete', wrapAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/delete', { spot });
}));
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id); //the findByIdAndDelete function triggers the findOneAndDelete middleware
    req.flash('success', 'Spot successfully deleted!');
    res.redirect('/spots');
}));

module.exports = router;