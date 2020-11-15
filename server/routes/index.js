var express = require('express');
var router = express.Router();

const Sources = require('../models/source');

/* GET home page. */
router.route('/data')
.get((req, res, next) => {
    Sources.find()
    .then((sources) => {
        res.render('index', {informations: sources});
    }, (err) => next(err))
    .catch((err) => next(err));
    // console.log(req);
    
})
.post((req, res, next) => {
    //console.log(req);
    if (req.body != null) {
        Sources.create({password: req.body.password, info:req.body.info})
        .then((result) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);            
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Encryption information not found in request body');
        err.status = 404;
        return next(err);
    }

});


module.exports = router;