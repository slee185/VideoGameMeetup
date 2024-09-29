// Require Modules
const express = require('express');
const morgan = require('morgan');
//const storyRoutes = require('./routes/');

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

/*
// Set up Routes
app.get('/', (req, res)=> {
    res.render('index');
});
*/

// Mount Rount
//app.use('/stories', storyRoutes);


// Start the Server
app.listen(port, host, ()=> {
    console.log('Server is running on port', port);
});