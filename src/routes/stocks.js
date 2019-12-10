const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/**
 * Route for listing part suppliers.
 */
router.get('/stocks', (req, res, next) => {
//  var ticker = document.getElementById('ticker');

    req.db.query('SELECT * FROM Stock', (err, results) => {
        // console.log("resultst are: " , results[0].ticker);
        if (err) return next(err);
        res.render(
            'stocks',
            createViewContext({
                pageName: 'All Stocks',
                rows: results
            })
        );
    });
});

router.get('/stocks/growing', (req, res, next) => {
//

    req.db.query('SELECT * FROM Stock WHERE pctChange > 0', (err, results) => {
        // console.log("resultst are: " , results[0].ticker);
        if (err) return next(err);
        res.render(
            'stocks',
            createViewContext({
                pageName: 'Growing Stocks',
                rows: results
            })
        );
    });
});
//
router.post('/stocks/add', (req, res, next) => {

  var id = req.body.Watch
  console.log(id);
  //res.redirect('/stocks');

});


// var addStock = function(){
//
// }
//
// addStock();


module.exports = router;
