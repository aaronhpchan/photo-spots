const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedIn, validateComment, isCommentAuthor } = require('../middleware');
const comments = require('../controllers/comments');

router.post('/', isLoggedIn, validateComment, wrapAsync(comments.createComment));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, wrapAsync(comments.deleteComment));

module.exports = router;