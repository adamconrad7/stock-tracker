const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/**
 * Route for listing part suppliers.
 */
// router.get('/parts', (req, res, next) => {
//     // TODO: implement the selection query
//     req.db.query(
//         `
//         SELECT p.pname, p.color, s.sname, s.city, c.price
//         FROM Catalog c, Parts p, Suppliers s
//         WHERE c.sid = s.sid AND c.pid = p.pid
//         ORDER BY p.pname, c.price, s.sname
//         `,
//         (err, results) => {
//             if (err) return next(err);
//             res.render(
//                 'parts',
//                 createViewContext({
//                     pageName: 'List Parts',
//                     rows: []
//                 })
//             );
//         }
//     );
//
// });
router.get('/parts', (req, res, next) => {
    // TODO: implement the selection query
    req.db.query(
        `
        SELECT St.ticker, St.sectorID FROM Sector Se, Stock St WHERE Se.sectorID = St.SectorID AND Se.sectorCap > 5000000000
        `,
        (err, results) => {
            if (err) return next(err);
            res.render(
                'parts',
                createViewContext({
                    pageName: 'Stocks in a sector worth more than $5 billion',
                    rows: results
                })
            );
        }
    );
});

router.get('/suppliers', (req, res, next) => {
    req.db.query('SELECT * FROM Stock', (err, results) => {
        if (err) return next(err);
        res.render(
            'suppliers',
            createViewContext({
                pageName: 'All Stocks',
                rows: results
            })
        );
    });
});

/**
 * Route for displaying the form used to add a new part supplier.
 */
router.get('/parts/add', (req, res) => {
    res.render('parts-add', createViewContext({ message: 'Add New Part' }));
});

/**
 * Logic for actually adding a new part supplier using data from a form submission.
 */
router.post('/parts/add', (req, res, next) => {
    let context = createViewContext();

    // Make sure a supplier with the provided SID doesn't already exist
    req.db.query('SELECT * FROM Parts WHERE pid = ?', [req.body.pid], (err, results) => {
        if (err) return next(err);

        if (results.length) {
            // Already exists
            context.message = `Can't create part with SID ${req.body.pid} because it already exists`;
            res.render('parts-add', context);
        } else {
            // Doesn't exist, create it
            req.db.query(
                'INSERT INTO Parts (pid, pname, color) VALUES (?,?,?)',
                [req.body.pid, req.body.pname, req.body.color],
                err => {
                    if (err) return next(err);

                    context.message = 'Record added successfully';
                    res.render('parts-add', context);
                }
            );
        }
    });
    // // TODO: add the insertion query
    // context.message = 'Add not implemented yet!';
    // res.render('suppliers-add', context);
});

module.exports = router;
