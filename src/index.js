const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { createViewContext } = require('./utils');
const stocksRouter = require('./routes/stocks');
const registerUserRouter = require('./routes/registerUser');
var loginUserRouter = require('./routes/loginUser');
const config = require('./config');
const router = express.Router();

const PORT = process.env.PORT || 3000;

// Create our application
const app = express();

// Set a location for express to serve static files from (CSS and JS)
app.use('/assets', express.static('assets'));

// Setup our view engine
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        ifeq: function(a, b, options) {
            if (a === b) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Connect to the database on each request. The database connection will be available as `req.db`.
// The connection will automatically close when the object is destroyed.
app.use((req, res, next) => {
    let conn = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.dbname,
        multipleStatements: true

    });
    conn.connect(function(err)  {
        if (err) {
            console.log("Error connecting to database.");
            return next(err);
        } else {          
            req.db = conn;
            next();
        }
    });
});



// Add our routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(stocksRouter);
app.use(registerUserRouter);
app.use(loginUserRouter);

// Add a handler to render a 404 view
app.use('*', (req, res) => {
    res.status(404);
    res.render('404', createViewContext());
});

// Add error handling
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err);
    res.status(500);
    res.render('500', createViewContext());
});

// var ticker = document.getElementById('ticker');
// console.log(ticker);
// Start our server
app.listen(PORT, () => {
    console.log('Server is listening on port ' + PORT + '. Press Ctrl + C to terminate');
});
