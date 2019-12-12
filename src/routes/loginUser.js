const express = require('express');
const { createViewContext } = require('../utils');
const Cryptr = require('cryptr');
cryptr = new Cryptr('secretKey');
const bcrypt = require('bcryptjs');



const router = express.Router();
var connection = require('./../config');

router.get('/', (req, res) => {
    // console.log("gpt request");
    res.render('user-login', createViewContext({ message: 'Login' }));
});

/**
  * Logic for actually adding a new part supplier using data from a form submission.
  */

router.post('/', (req, res, next) => {
    let context = createViewContext();
    console.log("got a post");
    // Make sure user exists and password matches
    req.db.query('SELECT * FROM User WHERE UserID = ?', [req.body.uName], (err, results) => {

        if (err) {
            res.json({
                status: false,
                message: 'there are some errors with query'
            })
        } else {

            if (results.length) {

                bcrypt.compare(req.body.uPass, results[0].Password, function (err, isMatch) {
                    if (err) {
                        throw err
                    } else if (!isMatch) {
                        console.log("Password doesn't match!")
                        context.message = "Password doesn't match.";
                        res.render('user-login', context);
                    } else {
                        console.log("Password matches!")
                        req.db.query(
                            ' UPDATE User SET current = 1 WHERE UserID = ?; UPDATE User SET current = 0 WHERE UserID != ?',
                            [req.body.uName, req.body.uName],
                            err => {
                                if (err) return next(err);

                            }
                        );
                        context.message = "Passwords match, logged in.";
                        res.render('user-login', context);
                    }
                })



                //if (localPassword == results[0].Password) {
                //    res.json({
                //        status: true,
                //        message: 'Successfully authenticated'
                //    })
                //    context.message = 'Successfully authenticated.';
                //    res.render('watchlist', context);
                //} else {
                //    res.json({
                //        status: false,
                //        message: "Username and password do not match"
                //    });
                //    context.message = 'Username and password do not match.';
                //}
            }
            else {
                console.log("Username does not exist")
                context.message = "Username does not exist, please try again or Register";
                res.render('user-login', context);
            }
        }
    });
});

module.exports = router;
