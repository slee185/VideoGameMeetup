// Require Modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');
const eventRoutes = require('./routes/eventRoutes');
const {fileUpload} = require('./middleware/fileUpload');
const path = require('path');
const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');

// Create App
const app = express();

// Configure App
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
const mongoUrl = 'mongodb+srv://JacobMiller:Jm32859299@cluster0.yv4lp.mongodb.net/VideoGameMeetup?retryWrites=true&w=majority&appName=Cluster0';

// connect to database
mongoose.connect(mongoUrl)
.then(()=>{  
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

// Mount Middleware
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'j298tu24p98tup34it',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl})
}));

app.use(flash());

app.use((req, res, next)=>{
    console.log(req.session);
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// Set up Routes
app.get('/', (req, res)=> {
    res.render('index');
});

// Mount Routes
app.use('/events', eventRoutes); 
app.use('/users', userRoutes);

//get signup form
app.get('/new', (req, res)=>{
    res.render('new');
});

//create a new user
app.post('/', (req, res, next)=>{
    let user = new User(req.body);
    user.save()
    .then(()=>res.redirect('/login'))
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/new');
        }
        if(err.code === 11000) {
            req.flash('error', 'Email address has been used');
            return res.redirect('/new');
        }
        next(err)
    });
});

//get login page
app.get('/login', (req, res)=>{
    res.render('login');
});

//process login request
app.post('/login', (req, res, next)=>{
    //authenticate user's login request
    let email = req.body.email;
    let password = req.body.password;

    //get user that matches email
    User.findOne({email: email})
    .then(user=>{
        if(user) {
            //user found in database
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id; //store user's id in session
                    req.flash('success', 'You have successfully logged in!');
                    res.redirect('/profile');
                } else {
                    // console.log('wrong password');
                    req.flash('error', 'Wrong password!');
                    res.redirect('users/login');
                }
            })
            .catch(err=>next(err));
        } else {
            // console.log('wrong email address');
            req.flash('error', 'Wrong email address!');
            res.redirect('users/login');
        }
    })
    .catch(err=>next(err));
});

//get profile
app.get('/profile', (req, res, next)=>{
    let id = req.session.user;
    User.findById(id)
    .then(user=>res.render('user/profile', {user}))
    .catch(err=>next(err));
});

app.post('/events', fileUpload, (req, res, next) => {
    let image = "./public/images/" + req.file.filename;
    res.render('index', {image});
    console.log('file has been submitted ', req.file, req.body);
});

app.use((req, res, next) => {
    let err = new Error('Server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});