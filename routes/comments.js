const express = require('express');
const router = express.Router({ mergeParams: true });
const { commentSchema } = require('../schemas.js');
const wrapAsync = require('../utilities/wrapAsync');
const ExpressError = require('../utilities/ExpressError');
const Spot = require('../models/spot');
const Comment = require('../models/comment');

const validateComment = (req, res, next) => {   
    const { error } = commentSchema.validate(req.body);
    if(error) {
        const errorMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(errorMsg, 400);
    } else {
        next();
    }
};

router.post('/', validateComment, wrapAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    spot.comments.push(comment);
    await comment.save();
    await spot.save();
    req.flash('success', 'Comment successfully created!');
    res.redirect(`/spots/${spot._id}`);
}));

router.delete('/:commentId', wrapAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Spot.findByIdAndUpdate(id, { $pull: { comments: commentId } }); //delete spot ObjectID which corresponds to the comment
    await Comment.findByIdAndDelete(commentId); 
    req.flash('success', 'Comment successfully deleted!');
    res.redirect(`/spots/${id}`);
}));

module.exports = router;