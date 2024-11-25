const {body, validationResult} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];


// TEST //
/*
exports.validateEvent = [body('name', 'Name cannot be empty').notEmpty().trim().escape(),
    body('game', 'Game cannot be empty').notEmpty().trim().escape(),
    body('categroy', 'Category cannot be empty').notEmpty().trim().escape(),
    body('platform', 'Platform cannot be empty').notEmpty().trim().escape(),
    body('location', 'Location cannot be empty').notEmpty().trim().escape(),
    body('date', 'Date cannot be empty').notEmpty().trim().escape(),
    body('startTime', 'Start Time cannot be empty').notEmpty().trim().escape(),
    body('endTime', 'End Time cannot be empty').notEmpty().trim().escape(),
    body('details', 'Details must be at least 10 characters').isLength({min: 10, max:64}).trim().escape()];
*/

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};