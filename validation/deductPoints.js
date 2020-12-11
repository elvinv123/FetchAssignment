const Validator = require('validator');

module.exports = function validatePointsDeduction(data) {
    let errors = {};

    if (Validator.isEmpty(data.points)) {
        errors.points = 'Points field is required';
    }

    if (!Validator.isNumeric(data.points)) {
        errors.points = 'Points should be an number';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};