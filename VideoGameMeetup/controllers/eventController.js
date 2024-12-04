// const {validationResult} = require('express-validator');
const Event = require('../models/event');
const User = require('../models/user');
const RSVP = require('../models/rsvp');

exports.index = (req, res, next) => {
    Event.find()
    .then(events=> res.render('./event/index', {events}))
    .catch(err=>next(err));
};

exports.new = (req, res)=> {
    res.render('./event/new');
}

exports.create = (req, res, next) => {
    let event = new Event(req.body);
    event.host = req.session.user;
    event.imageFlyer = "/images/" + req.file.filename;
    event.save()
    .then(event=> res.redirect('/events'))
    .catch(err=>{
        if (err.name === 'ValidationError') {
            err.status = 400; 
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    let eventId = req.params.id;
    let userId = req.session.user ? req.session.user._id : null;

    Event.findById(eventId)
    .populate('host', 'firstName lastName') // Populating only firstName and lastName of the host
    .populate('rsvps') // Populate RSVPs for the event
    .then(event => {

        if (!event) {
            const err = new Error('Cannot find an event with id ' + eventId);
            err.status = 404;
            return next(err);
        }

        // Format and process event data
        const formatCategory = (type) => type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const formatPlatform = (platform) => platform.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const formatTime = (time) => {
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(hours, minutes);
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        };
        const formatDate = (dateString) => {
            const [year, month, day] = dateString.split('-');
            const date = new Date(year, month - 1, day);

            const daySuffix = (day) => {
                if (day > 3 && day < 21) return 'th';
                switch (day % 10) {
                    case 1: return 'st';
                    case 2: return 'nd';
                    case 3: return 'rd';
                    default: return 'th';
                }
            };

            const dayWithSuffix = `${day}${daySuffix(parseInt(day, 10))}`;
            const options = { weekday: 'long', month: 'long', year: 'numeric' };
            const formattedDateParts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);

            const weekday = formattedDateParts.find(part => part.type === 'weekday').value;
            const monthName = formattedDateParts.find(part => part.type === 'month').value;
            const yearNum = formattedDateParts.find(part => part.type === 'year').value;

            return `${weekday} ${monthName} ${dayWithSuffix}, ${yearNum}`;
        };

        event.formattedCategory = formatCategory(event.type);
        event.formattedPlatform = formatPlatform(event.platform);
        event.formattedStartTime = formatTime(event.startTime);
        event.formattedEndTime = formatTime(event.endTime);
        event.formattedDate = formatDate(event.date);

        // count 'yes' rsvps
        const yesCount = event.rsvps.filter(rsvp => rsvp.status === 'YES').length;

        // check if user has rsvp'd and get their status
        let userRsvpStatus = null;
        if (userId) {
            const userRsvp = event.rsvps.find(rsvp => rsvp.user._id.toString() === userId.toString());
            if (userRsvp) {
                userRsvpStatus = userRsvp.status;
            }
        }

        // is current user host?
        const isHost = userId && event.host._id.toString() === userId.toString();

        res.render('./event/show', { event, yesCount, userRsvpStatus, isHost });
    })
    .catch(err => next(err));
};

exports.rsvpEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = req.session.user;
    const {status} = req.body;

    // confirm valid status
    if (!['YES', 'NO', 'MAYBE'].includes(status)) {
        const err = new Error('Invalid RSVP status');
        err.status = 400;
        return next(err);
    }

    Event.findById(eventId)
        .then(event => {
            return User.findById(userId)
            .then(user => {
                return RSVP.findOne({user: userId, event: eventId})
                .then(existingRsvp => {
                    if (existingRsvp) {
                        // update rsvp
                        existingRsvp.status = status;
                        return existingRsvp.save();
                    } else {
                        // new rsvp
                        const newRsvp = new RSVP({
                            user: userId,
                            event: eventId,
                            status: status
                        });

                        return newRsvp.save()
                            .then(savedRsvp => {
                                event.rsvps.push(savedRsvp._id);
                                return event.save();
                            });
                    }
                });
            })            
        })
        .then(() => {
            res.redirect(`/events/${eventId}`);
        })
        .catch(err => next(err));
};


// exports.rsvpEvent = (req, res, next) => {
//     const eventId = req.params.eventId;
//     const userId = req.session.user;
//     const {status} = req.body;

//     // confirm valid status
//     if (!['YES', 'NO', 'MAYBE'].includes(status)) {
//         const err = new Error('Invalid RSVP status');
//         err.status = 400;
//         return next(err);
//     }

//     Event.findById(eventId)
//         .then(event => {
//             // is user rsvp'd to this event
//             return RSVP.findOne({user: userId, event: eventId})
//                 .then(existingRsvp => {
//                     if (existingRsvp) {
//                         // update rsvp
//                         existingRsvp.status = status;
//                         return existingRsvp.save();
//                     } else {
//                         // new rsvp
//                         const newRsvp = new RSVP({
//                             user: userId,
//                             event: eventId,
//                             status: status
//                         });

//                         return newRsvp.save()
//                             .then(savedRsvp => {
//                                 event.rsvps.push(savedRsvp._id);
//                                 return event.save();
//                             });
//                     }
//                 })
//                 .then(() => {
//                     // update user's rsvps array
//                     return User.findById(userId)
//                     .then(user => {
//                         return RSVP.findOne({user: userId, event: eventId})
//                         .then(existingRsvp => {
//                             if (existingRsvp) {
//                                 // update rsvp
//                                 existingRsvp.status = status;
//                                 return existingRsvp.save();
//                             } else {
//                                 // new rsvp
//                                 const newRsvp = new RSVP({
//                                     user: userId,
//                                     event: eventId,
//                                     status: status
//                                 });
        
//                                 return newRsvp.save()
//                                     .then(savedRsvp => {
//                                         user.rsvps.push(savedRsvp._id);
//                                         return user.save();
//                                     });
//                             }
//                         })
//                     });
//                 });
//         })
//         .then(() => {
//             res.redirect(`/events/${eventId}`);
//         })
//         .catch(err => next(err));
// };

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    Event.findById(id)
    .then(event=>{
        return res.render('./event/edit', {event});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let event = req.body;
    let id = req.params.id;
    Event.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators:true})
    .then(event=>{
        req.flash('success', 'Event successfully updated');
        res.redirect('/events/'+id);
    }) 
    .catch(err=>{
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    Event.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event=>{
        req.flash('success', 'Event successfully deleted');
        res.redirect('/events');
    })
    .catch(err=> next(err));
};
