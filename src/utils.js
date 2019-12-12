const config = require('./config');

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
                
                menuitems: [
                    { location: '/user/add', page: 'Register user' },
                    { location: '/user/login', page: 'Login' },
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
