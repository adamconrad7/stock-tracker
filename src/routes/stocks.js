const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();
var datetime = new Date().toISOString().slice(0,10);;


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

router.post('/stocks', (req, res, next) => {
  let context = createViewContext();

  // var id = req.body.Watch


  // We want to insert into watches the id of the user who has current =1 and the ticker recivied by this
  //if current user adds stock that is already on their watchlist
  req.db.query('SELECT * FROM Watches w, User u WHERE w.ticker = ? AND u.current = 1 AND u.UserID = w.userID', [req.body.Watch], (err, results) => {
      if (err) return next(err);

      if (results.length) {
          // Already exists
          console.log("Already watching");
      //    context.message = `Can't add stock ${req.body.Watch} because it already exists`;
          res.redirect('/stocks');
      } else {
        console.log(datetime);
          req.db.query(
            'INSERT INTO Watches (userID, ticker, date) SELECT UserID, ?, ? FROM User WHERE current = 1',
            [req.body.Watch, datetime],
              err => {
                if (err) return next(err);
              //  console.log(UserID);
                context.message = 'Stock added successfully';
                res.redirect('/stocks');
                // res.render('stocks', context);

              }
          );
      // );
      }
  });

  //res.redirect('/stocks');

});


router.get('/stocks/growing', (req, res, next) => {
//
//  CREATE VIEW growing AS SELECT * FROM Stock WHERE pctChange > 0
     //req.db.query('SELECT * FROM Stock WHERE pctChange > 0', (err, results) => {
    //  req.db.query('CREATE VIEW growing AS SELECT * FROM Stock WHERE pctChange > 0; SELECT * FROM growing', (err, results) => {
      req.db.query('SELECT * FROM grow', (err, results) => {
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


router.get('/stocks/large', (req, res, next) => {
//  // TODO: implement the selection query
  req.db.query(
      `
      SELECT St.ticker, St.sectorID FROM Sector Se, Stock St WHERE Se.sectorID = St.SectorID AND Se.sectorCap > 200
      `,
      (err, results) => {
          if (err) return next(err);
          res.render(
              'parts',
              createViewContext({
                  pageName: 'Stocks in a sector worth more than $200',
                  rows: results
              })
          );
      }
  );
});


router.get('/watchlist', (req, res, next) => {
  req.db.query( 'SELECT * FROM `Stock` S, `Watches` W, `User` U WHERE S.ticker = W.ticker AND W.userID = U.userID AND U.current = 1' , (err, results) => {
    if (err) return next(err);
    console.log(results);
    res.render(
        'watchlist',
        createViewContext({
            pageName: 'Your Stocks',
            rows: results
        })
    );
  });
});

router.get('/watchlist/totals', (req, res, next) => {
  req.db.query( 'SELECT AVG(s.currentPrice) as avgPrice, AVG(s.pctChange) as avgChange, SUM(s.currentPrice) as total FROM `Watches` w, `Stock` s, `User` u WHERE w.ticker = s.ticker AND w.userID = u.UserID AND u.current = 1'
 , (err, results) => {
    if (err) return next(err);
    console.log(results);
    res.render(
        'watch_totals',
        createViewContext({
            pageName: 'Total Data',
            rows: results
        })
    );
  });
});


module.exports = router;
