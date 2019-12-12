const config = require('./config');
const express = require('express');
const router = express.Router();
var username = "Please Log in"

///**
// * Route for listing part suppliers.
// */
router.get('/', (req, res, next) => {
    //  var ticker = document.getElementById('ticker');

    req.db.query('SELECT UserID FROM User WHERE current = 1', (err, results) => {
        if (err) return next(err);

        if (results.length) {
            console.log(results[0].UserID)
            username = results[0].UserID
        }
        res.render(
            'stocks',
            createViewContext({
                pageName: 'All Stocks',
                rows: results
            })
        );
    });
});

module.exports = {
    /**
     * Generates the context object used to render views with Handlebars.
     *
     * There are some global context values that should be applied to all views. These are set here. Additional context
     * can be passed to the function as an object.
     *
     * @param {object} [obj] The page-specific context used to render a Handlebars template.
     * @returns {object} The context used to render the page.
     */
    createViewContext: obj =>
        Object.assign(
            {
                username: username,
                menuitems: [
                    { location: '/user/add', page: 'Register user' },
                    { location: '/', page: 'Login' },
                    { location: '/stocks/large', page: 'Large Sector Stocks' },
                    { location: '/stocks/growing', page: 'Growing Stocks' },
                    { location: '/watchlist/totals', page: 'Totals' },
                    { location: '/watchlist', page: 'Your Stocks' },
                    { location: '/stocks', page: 'All Stocks' }
                ]
            },
            obj
        )
};
