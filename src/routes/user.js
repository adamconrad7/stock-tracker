const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/**
 * Route for listing part suppliers.
 */
// router.get('/suppliers', (req, res, next) => {
//     req.db.query('SELECT * FROM Stock', (err, results) => {
//         if (err) return next(err);
//         res.render(
//             'suppliers',
//             createViewContext({
//                 pageName: 'All Stocks',
//                 rows: results
//             })
//         );
//     });
// });

/**
 * Route for displaying the form used to add a new part supplier.
 */
router.get('/login', (req, res) => {
   // console.log("gpt request");
    res.render('add-user', createViewContext({ message: 'Register New User' }));
});


 /**
  * Logic for actually adding a new part supplier using data from a form submission.
  */
//
router.post('/login', (req, res, next) => {
    let context = createViewContext();

    // Make sure a supplier with the provided SID doesn't already exist
    req.db.query('SELECT * FROM User WHERE UserID = ?', [req.body.uName], (err, results) => {
        if (err) return next(err);

        if (results.length) {
            // Already exists
            context.message = `Can't create user with username ${req.body.uName} because it already exists`;
            res.render('add-user', context);
        } else {
            // Doesn't exist, create it
            console.log(req.body.uName, req.body.uPass);
            req.db.query(
                'INSERT INTO User (UserID, Password, lName, fName) VALUES (?,?,?,?)',
                [req.body.uName, req.body.uPass, req.body.lName, req.body.fName],
                err => {
                    if (err) return next(err);
                    console.log("No error");
                    context.message = 'Record added successfully';
                    res.render('add-user', context);
                }
            );
        }
    });
});

module.exports = router;
