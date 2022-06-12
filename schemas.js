const Joi = require('joi');

module.exports.spotSchema = Joi.object({
    spot: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});