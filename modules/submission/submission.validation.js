const { body } = require('express-validator');

const submitValidation = [
    body('problemId').notEmpty().withMessage('problemId is required'),
    body('language').notEmpty().withMessage('language is required'),
    body('code').notEmpty().withMessage('code is required')
];

const runValidation = [
    body('problemId').notEmpty().withMessage('problemId is required'),
    body('language').notEmpty().withMessage('language is required'),
    body('code').notEmpty().withMessage('code is required')
];

module.exports = { submitValidation, runValidation };
