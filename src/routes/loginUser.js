const express = require('express');
const { createViewContext } = require('../utils');
const Cryptr = require('cryptr');
cryptr = new Cryptr('secretKey');
const bcrypt = require('bcryptjs');

//// Nodejs encryption with CTR
//const crypto = require('crypto');
//const algorithm = 'aes-256-cbc';
//var key = crypto.randomBytes(32);
//var iv = crypto.randomBytes(16);

//function encrypt(text) {
//    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//    let encrypted = cipher.update(text);
//    encrypted = Buffer.concat([encrypted, cipher.final()]);
//    return encrypted.toString('hex')
//}

const router = express.Router();
var connection = require('./../config');

router.get('/user/login', (req, res) => {
    // console.log("gpt request");
    res.render('user-login', createViewContext({ message: 'Login' }));
});

/**
  * Logic for actually adding a new part supplier using data from a form submission.
  */

router.post('/user/login', (req, res, next) => {
    let context = createViewContext();

    // Make sure user exists and password matches
    req.db.query('SELECT * FROM User WHERE UserID = ?', [req.body.uName], (err, results) => {
        
        if (err) {
            res.json({
                status: false,
                message: 'there are some errors with query'
            })
        } else {
            //var localPassword = cryptr.encrypt(req.body.uPass);
            //key = results[0].key1;
            //iv = results[0].iv;
            //var localPassword = encrypt(req.body.uPass);

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
                res.json({
                    status: false,
                    message: "Username does not exits"
                });
            }
        }
    });
});

module.exports = router;