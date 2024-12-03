// const {validationResult} = require('express-validator');
const Event = require('../models/event');
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
    let id = req.params.id;
    Event.findById(id).populate('host', 'firstName lastName')
    .populate('rsvps') // populate RSVPs for the event
    .then(event=>{
        if(event) {
            // calculate # of YES RSVPs
            const yesCount = event.rsvps.filter(rsvp => rsvp.status === 'YES').length;
            // format category
            const formatCategory = (type) => {
                return type
                    .split('-') 
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            };
            // format platform
            const formatPlatform = (platform) => {
                return platform
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            };
            // format times
            const formatTime = (time) => {
                const [hours, minutes] = time.split(':');
                const date = new Date();
                date.setHours(hours, minutes);
                return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }
            // format date
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

            console.log(event);
            return res.render('./event/show', {event, yesCount});
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.rsvpEvent = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    const {eventId} = req.params;
    const {status} = req.body;

    if (!['YES', 'NO', 'MAYBE'].includes(status)) {
        return res.status(400).send('Invalid RSVP status');
    }

    try {
        const event = Event.findById(eventId);
        // check if user is host
        if (event.host.equals(req.user._id)) {
            return res.status(401).send('You cannot RSVP for your own event');
        }
        // create or update RSVP
        const rsvp = RSVP.findOneAndUpdate(
            {user: req.user._id, event: eventId},
            {status},
            {upsert: true, new: true}
        );
        // update evnt and count "YES" RSVPs
        const updatedEvent = Event.findById(eventId).populate('rsvps');
        const yesCount = updatedEvent.rsvps.filter(rsvp => rsvp.status === 'YES').length;
        // redirect to event page with updated rsvp count
        res.redirect(`/events/${eventId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

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
