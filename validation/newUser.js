const Validator = require('validator');

module.exports = function validateNewUser(data) {
    let errors = {};

    if (Validator.isEmpty(data.username)) {
        errors.username = 'username field is required';
    }  

    if (!Validator.isLength(data.username, { min: 5, max: 20 })) {
        errors.username = 'Username must be at least 5 characters';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};