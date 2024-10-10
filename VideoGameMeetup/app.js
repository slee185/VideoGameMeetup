// Require Modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const eventRoutes = require('./routes/eventRoutes');
const {fileUpload} = require({dest: './middleware/fileUpload' });

// Create App
const app = express();

// Configure App
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

// Mount Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// Set up Routes
app.get('/', (req, res)=> {
    res.render('index');
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

app.post('/', fileUpload, (req, res, next) => {
    let image = "./images/" + req.file.filename;
    res.render('index', {image});
});

// Start the Server
app.listen(port, host, ()=> {
    console.log('Server is running on port', port);
});