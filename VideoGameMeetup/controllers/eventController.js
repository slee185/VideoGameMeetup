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
        res.redirect('/events');
    })
    .catch(err=> next(err));
};
