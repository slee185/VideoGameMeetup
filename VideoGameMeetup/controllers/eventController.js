const model = require('../models/event');

exports.index = (req, res) => {
    let events = model.find();
    res.render('./event/index', {events});
};

exports.new = (req, res)=> {
    res.render('./event/new');
}

exports.create = (req, res) => {
    let event = req.body;
    model.save(event);
    console.log(model.find());  // Check if the event is added
    res.redirect('/events');
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    let event = model.findById(id);
    if (event) {
        res.render('./event/show', {event});
    } else {
        let err = new Error('No valid event with id ' + id);
        err.status = 404;
        next(err);
    }
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    let event = model.findById(id);
    if (event) {
        res.render('./event/edit', {event});
    } else {
        let err = new Error('No valid event with id ' + id);
        err.status = 404;
        next(err);
    } 
};

exports.update = (req, res, next)=>{
    let event = req.body;
    let id = req.params.id;

   if (model.updateById(id, event)) {
        res.redirect('/events/' + id);
   } else {
        let err = new Error('No valid event with id ' + id);
        err.status = 404;
        next(err);
   }
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    if (model.deleteById(id)) {
        res.redirect('/events');
    } else {
        let err = new Error('No valid event with id ' + id);
        err.status = 404;
        next(err);
    }
};
