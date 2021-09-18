//VALIDATION
const Joi = require('@hapi/joi');

//Registration validation
const registrationValidation = data => {
        const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data)
}

const loginValidation = data => {
        const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data)
}

const linkValidation = data => {
        const schema = Joi.object({
        title: Joi.string().required(),
        hyperlink: Joi.string().required()
    });
    return schema.validate(data)
}

module.exports.registrationValidation = registrationValidation;
module.exports.loginValidation = loginValidation;
module.exports.linkValidation = linkValidation;