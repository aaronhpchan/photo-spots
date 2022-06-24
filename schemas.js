const Joi = require('joi');

module.exports.spotSchema = Joi.object({
    spot: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        //image: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});
