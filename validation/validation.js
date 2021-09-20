//VALIDATION
const Joi = require('@hapi/joi');

//Registration validation
const registrationValidation = data => {
        const schema = Joi.object({
        username: Joi
            .string()
            .alphanum()
            .min(6)
            .max(30)
            .required(),
        name: Joi
            .string()
            .alphanum()
            .max(255)
            .min(3)
            .required(),
        email: Joi
            .string()
            .min(6)
            .max(255)
            .required()
            .email(),
        password: Joi
            .string()
            .min(8)
            .max(1024)
            .required(),
        repeat_password: Joi
            .ref('password')
    });
    return schema.validate(data)
}

const loginValidation = data => {
        const schema = Joi
            .object({
        email: Joi
            .string()
            .min(6)
            .max(255)
            .required()
            .email(),
        password: Joi
            .string()
            .min(8)
            .max(1024)
            .required()
    });
    return schema.validate(data)
}

const linkValidation = data => {
        const schema = Joi
            .object({
        title: Joi
            .string()
            .alphanum()
            .required(),
        hyperlink: Joi
            .string()
            .required()
    });
    return schema.validate(data)
}

module.exports.registrationValidation = registrationValidation;
module.exports.loginValidation = loginValidation;
module.exports.linkValidation = linkValidation;