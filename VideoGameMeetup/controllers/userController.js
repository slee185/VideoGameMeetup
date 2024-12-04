const model = require('../models/user');
const Event = require('../models/event');
const RSVP = require('../models/rsvp');

exports.new = (req, res)=>{
    return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    if(user.email)
        user.email = user.email.toLowerCase();
    user.save()
    .then(user=> {
        req.flash('success', 'Account successfully created');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
    
        next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
};

exports.login = (req, res, next)=>{
    let email = req.body.email;
    if (email)
        email = email.toLowerCase();
    let password = req.body.password;

    model.findOne({email: email})
    .then(user => {
        if (!user) {
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
        } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            })
            .catch(err => {
                req.flash('error', 'Server error');
                res.redirect('/users/login');
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;

    Promise.all([
        model.findById(id),
        Event.find({ host: id }), // Events created by the user
        RSVP.find({ user: id }).populate('event') // Events the user has RSVPed to
    ])
    .then(results => {
        const [user, events] = results;
        
        // Extract events from the user's RSVPs
        const rsvpEvents = user.rsvps.map(rsvp => rsvp.event); // Extract the event object from each RSVP
        console.log(rsvpEvents);  // This should show an array of events (or null/undefined)

        
        // Render the profile page, passing both created events and RSVP events
        res.render('user/profile', { 
            user, 
            events, 
            rsvpEvents
        });
    })
    .catch(err => next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
 };