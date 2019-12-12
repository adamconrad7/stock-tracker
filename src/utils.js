const config = require('./config');
const express = require('express');
// const { createViewContext } = require('../utils');

const router = express.Router();


var name;
router.get('/*', (req, res, next) => {
//  var ticker = document.getElementById('ticker');
req.db.query('SELECT UserID FROM User WHERE current = 1', (err, results) => {
  // console.log("resultst are: " , results[0].ticker);
  if (err) return next(err);
  console.log(results.UserID);
  name = results.UserID;
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
                username: name,
                menuitems: [

                    { location: '/stocks', page: 'All Stocks' },
                    { location: '/stocks/growing', page: 'Growing Stocks' },
                    { location: '/stocks/large', page: 'Large Sector Stocks' },

                    { location: '/user/add', page: 'Register user' },
                    { location: '/', page: 'Login' },
                    { location: '/watchlist', page: 'Your Stocks' },
                    { location: '/watchlist/totals', page: 'Totals' }
                ]
            },
            obj
        )
};
