// Require Modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');
const eventRoutes = require('./routes/eventRoutes');
const {fileUpload} = require('./middlewares/fileUpload');
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

app.use(async (req, res, next) => {
    if (req.session.user) {
        try {
            const user = await User.findById(req.session.user).lean();
            res.locals.user = user || null;
        } catch (error) {
            console.error('Error fetching user in middleware:', error);
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
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