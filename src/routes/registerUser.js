const express = require('express');
const { createViewContext } = require('../utils');
const Cryptr = require('cryptr');
cryptr = new Cryptr('secretKey');
const bcrypt = require('bcryptjs');
const saltRounds = 10;


const router = express.Router();


/**
 * Route for displaying the form used to add a new part supplier.
 */
router.get('/user/add', (req, res) => {
   // console.log("gpt request");
    res.render('user-add', createViewContext({ message: 'Register New User' }));
});


 /**
  * Logic for actually adding a new part supplier using data from a form submission.
  */
//
router.post('/user/add', (req, res, next) => {
    let context = createViewContext();

    // Make sure a user with the provided SID doesn't already exist
    req.db.query('SELECT * FROM User WHERE UserID = ?', [req.body.uName], (err, results) => {
        if (err) return next(err);

        if (results.length) {
            // Already exists
            context.message = `Can't create user with username ${req.body.uName} because it already exists`;
            res.render('user-add', context);
        } else {
            // Doesn't exist, create it
 
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                    throw err
                } else {
                    bcrypt.hash(req.body.uPass, salt, function (err, hash) {
                        if (err) {
                            throw err
                        } else {
                            req.db.query(
                                'INSERT INTO User (UserID, Password, lName, fName) VALUES (?,?,?,?)',
                                [req.body.uName, hash, req.body.lName, req.body.fName],
                                err => {
                                    if (err) return next(err);
                                    console.log("No error");
                                    context.message = 'Record added successfully, please login.';
                                    res.render('user-add', context);
                                }
                            );
                        }
                    })
                }
            })

            

        }
    });
});

module.exports = router;
