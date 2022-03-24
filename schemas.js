const BaseJoi = require("joi");
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
type: 'string',
base: joi.string(),
messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
},
rules: {
    escapeHTML: {
        validate(value, helpers) {
            const clean = sanitizeHTML(value, {
                allowedTags: [],
                allowedAttributes: {},
            });
            if(clean !== value) return helpers.error('string.escapeHTML', {value})
            return clean;
        }
    }
}
})

const Joi = BaseJoi.extend(extension);

module.exports.animalSchema = Joi.object({
    animal: Joi.object({
        title: Joi.string().required().escapeHTML(),
      //  image: Joi.string().uri(),
        status: Joi.string().required().escapeHTML(),       
        description: Joi.string().required().escapeHTML(),
        areal: Joi.string().required().escapeHTML(),
        map: Joi.string().uri().escapeHTML(),
        location: Joi.string().escapeHTML(),
        source: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array(),
    verticalImages: Joi.array()
})

module.exports.additionSchema = Joi.object({
    addition: Joi.object({
       // image: Joi.string(),   
        body: Joi.string().required().escapeHTML(),
        source: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array(),
    verticalImages: Joi.array()
})

module.exports.feedbackSchema = Joi.object({
    feedback: Joi.object({
       username: Joi.string().required().escapeHTML(),
       body: Joi.string().required().escapeHTML(),
    //    address: Joi.string().required().escapeHTML(),
    }).required()
})