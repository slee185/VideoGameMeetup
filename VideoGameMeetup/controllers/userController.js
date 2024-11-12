const model = require('../models/user');
const Event = require('../models/event');


exports.index = (req, res, next)=>{
    //res.send('send all users');
    model.find()
    .then(users=>res.render('./user/index', {users}))
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./user/new');
};

exports.profile = (req, res)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Event.find({host: id})])
    .then(results=>{
        const [user, events] = results;
        res.render('user/profile', {user, events});
    })
    .catch(err=>next(err));
};

exports.create = (req, res, next)=>{
    //res.send('Created a new user');
    let user = new model(req.body);//create a new user document
    user.save()//insert the document to the database
    .then(user=> res.redirect('/users/login'))
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            err.status = 400;
        }
        next(err);
    });
};

exports.login = (req, res)=>{
    res.render('user/login');
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
};

// exports.processLogin = (req, res, next) => {

// };

// exports.show = (req, res, next)=>{
//     // res.render('./user/profile');

//     let id = req.params.id;
//     //an objectId is a 24-bit Hex string
//     if(!id.match(/^[0-9a-fA-F]{24}$/)) {
//         let err = new Error('Invalid user id');
//         err.status = 400;
//         return next(err);
//     }
//     model.findById(id)
//     .then(user=>{
//         if(user) {
//             return res.render('./user/profile', {user});
//         } else {
//             let err = new Error('Cannot find a user with id ' + id);
//             err.status = 404;
//             next(err);
//         }
//     })
//     .catch(err=>next(err));
// };

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid user id');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(user=>{
        if(user) {
            return res.render('./user/edit', {user});
        } else {
            let err = new Error('Cannot find a user with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let user = req.body;
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid user id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndUpdate(id, user, {useFindAndModify: false, runValidators: true})
    .then(user=>{
        if(user) {
            res.redirect('/users/'+id);
        } else {
            let err = new Error('Cannot find a user with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid user id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(user =>{
        if(user) {
            res.redirect('/users');
        } else {
            let err = new Error('Cannot find a user with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};