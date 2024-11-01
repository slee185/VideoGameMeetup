// Require Modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes');
const {fileUpload} = require('./middleware/fileUpload');
const path = require('path');

// Create App
const app = express();

// Configure App
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
const mongoUrl = 'mongodb+srv://JacobMiller:Jm32859299@cluster0.yv4lp.mongodb.net/VideoGameMeetup?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUrl)
.then(()=>{  
    app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});
})
.catch(err=>console.log(err.message));
//console.log(err);
``
// Mount Middleware
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// Set up Routes
app.get('/', (req, res)=> {
    res.render('index');
});

app.post('/events', fileUpload, (req, res, next) => {
    let image = "./images/" + req.file.filename;
    res.render('index', {image});
});

// Mount Rount
app.use('/events', eventRoutes); 

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
