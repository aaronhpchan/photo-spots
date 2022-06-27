const { spotSchema, commentSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');
const Spot = require('./models/spot');
const Comment = require('./models/comment');

module.exports.isLoggedIn = (req, res, next) => {
    const { id } = req.params;
    if (!req.isAuthenticated()) {       
        req.session.returnTo = (req.query._method === 'DELETE' ? `/spots/${id}` : req.originalUrl); 
        req.flash('error', 'You must be logged in to access this feature.');
        return res.redirect('/login');
    } 
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    if (!spot.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/spots/${id}`);
    }
    next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect(`/spots/${id}`);
    }
    next();
};

module.exports.validateSpot = (req, res, next) => {   
    const { error } = spotSchema.validate(req.body);
    if(error) {
        const errorMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(errorMsg, 400);
    } else {
        next();
    }
};

module.exports.validateComment = (req, res, next) => {   
    const { error } = commentSchema.validate(req.body);
    if(error) {
        const errorMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(errorMsg, 400);
    } else {
        next();
    }
};

