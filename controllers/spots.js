const Spot = require('../models/spot');

module.exports.index = async (req, res) => {
    const spots = await Spot.find({});
    res.render('spots/index', { spots });
};

module.exports.renderNewForm = (req, res) => {
    res.render('spots/new');
};

module.exports.createSpot = async (req, res, next) => {
    const spot = new Spot(req.body.spot);
    spot.author = req.user._id;
    await spot.save();
    req.flash('success', 'Spot successfully created!');
    res.redirect(`/spots/${spot._id}`);   
};

module.exports.showSpot = async (req, res) => {
    const spot = await Spot.findById(req.params.id).populate({
        path: 'comments',
        populate: { path: 'author' }
    }).populate('author');
    if(!spot) {
        req.flash('error', 'Cannot find spot.');
        return res.redirect('/spots');
    }
    res.render('spots/details', { spot });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    if(!spot) {
        req.flash('error', 'Cannot find spot.');
        return res.redirect('/spots');
    }
    res.render('spots/edit', { spot });
};

module.exports.updateSpot = async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    req.flash('success', 'Spot successfully updated!');
    res.redirect(`/spots/${spot._id}`);
};

module.exports.renderDeleteForm = async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/delete', { spot });
};

module.exports.deleteSpot = async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id); //the findByIdAndDelete function triggers the findOneAndDelete middleware
    req.flash('success', 'Spot successfully deleted!');
    res.redirect('/spots');
};