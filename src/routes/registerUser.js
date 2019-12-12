const express = require('express');
const { createViewContext } = require('../utils');
const Cryptr = require('cryptr');
cryptr = new Cryptr('secretKey');

// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key1 = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

console.log(key1);
console.log(iv);

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key1), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex')
};

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
            //taken from http://coding-karma.com/2017/08/12/creating-login-registration-using-nodejs-mysql/
            console.log(req.body.uName, req.body.uPass);
            //var encryptedString = cryptr.encrypt(req.body.uPass);

            var encryptedString = encrypt(req.body.uPass);
            console.log(key1);
            console.log(iv);
            req.db.query(
                'INSERT INTO User (UserID, Password, lName, fName, key1, iv) VALUES (?,?,?,?,?,?)',
                [req.body.uName, encryptedString, req.body.lName, req.body.fName, key1, iv],
                err => {
                    if (err) return next(err);
                    console.log("No error");
                    context.message = 'Record added successfully, please login.';
                    res.render('user-add', context);
                }
            );

        }
    });
});

module.exports = router;
