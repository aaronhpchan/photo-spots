const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedIn, validateComment, isCommentAuthor } = require('../middleware');
const Spot = require('../models/spot');
const Comment = require('../models/comment');

router.post('/', isLoggedIn, validateComment, wrapAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    spot.comments.push(comment);
    await comment.save();
    await spot.save();
    req.flash('success', 'Comment successfully created!');
    res.redirect(`/spots/${spot._id}`);
}));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, wrapAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Spot.findByIdAndUpdate(id, { $pull: { comments: commentId } }); //delete spot ObjectID which corresponds to the comment
    await Comment.findByIdAndDelete(commentId); 
    req.flash('success', 'Comment successfully deleted!');
    res.redirect(`/spots/${id}`);
}));

module.exports = router;