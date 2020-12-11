const Validator = require('validator');

module.exports = function validatePointsInput(data) {
    let errors = {};

    if (Validator.isEmpty(data.userId)) {
        errors.userId = 'userId field is required';
    }

    if (Validator.isEmpty(data.partner)) {
        errors.partner = 'Partner field is required';
    }

    if (Validator.isEmpty(data.points)) {
        errors.points = 'Points field is required';
    }

    if (Validator.isEmpty(data.date)) {
        errors.date = 'Date field is required';
    }

    if (!Validator.isNumeric(data.userId)) {
        errors.userId = 'userId should be an number';
    }

    if (!Validator.isNumeric(data.points)) {
        errors.points = 'Points should be an number';
    }

    if (!Validator.isDate(data.date)) {
        errors.date = 'Must be in correct date format';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};