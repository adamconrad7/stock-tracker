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
                username: config.onid,
                menuitems: [
                    { location: '/catalog', page: 'View Catalog' },
                    // { location: '/suppliers', page: 'List Suppliers' },
                    { location: '/stocks', page: 'All Stocks' },
                    { location: '/stocks/growing', page: 'Growing Stocks' },
                    { location: '/parts', page: 'Large Sector Stocks' },
                    { location: '/parts/add', page: 'Add Part' },
                    { location: '/user/add', page: 'Register user' },
                    { location: '/user/login', page: 'Login' },
                ]
            },
            obj
        )
};
