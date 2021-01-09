const express = require('express');
const router  = express.Router();

router.get('/', (req, res, next) => {
    console.log(req.query)  
    res.render('welcomePage', {layout: false});
});

router.get('/error-login', (req, res, next) => {
    console.log(req.query)  
    res.render('welcomePageErrorAuth', {layout: false, errorAuth: "Email or password incorrect"});
});

module.exports = router;
