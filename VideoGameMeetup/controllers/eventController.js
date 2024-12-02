const {validationResult} = require('express-validator');
const model = require('../models/event');

exports.index = (req, res, next) => {
    model.find()
    .then(events=> res.render('./event/index', {events}))
    .catch(err=>next(err));
};

exports.new = (req, res)=> {
    res.render('./event/new');
}

exports.create = (req, res, next) => {
    let event = new model(req.body);
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
    model.findById(id).populate('host', 'firstName lastName')
    .then(event=>{
        if(event) {
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
            return res.render('./event/show', {event});
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(event=>{
        return res.render('./event/edit', {event});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let event = req.body;
    let id = req.params.id;
    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators:true})
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
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event=>{
        req.flash('success', 'Event successfully deleted');
        res.redirect('/events');
    })
    .catch(err=> next(err));
};
