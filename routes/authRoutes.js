const passport = require('passport');
const router = require('express').Router();
const { isAuth, isNotAuth } = require('../services/middleware');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/success');
    } else {
        let date = new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'full',
            timeStyle: 'long'
        }).format(new Date());
        res.render('index', {
            date_tag: date,
            message_tag: 'Access your Google Account',
        });
    }
});

router.get('/home'), (req, res) => {
    res.redirect('/');
}

router.get('/success', (req, res) => {
    if (req.isAuthenticated()) {
        console.log("User Authenticated:", req.isAuthenticated());
        console.log('Session expires in:', req.session.cookie.maxAge / 1000);
        res.render('success', {
            message: 'Authorization Successful!',
            user: req.user
        });
    } else {
        res.redirect('/error');
    }
});

router.get('/resource', isAuth, (req, res, next) => {
    res.render('resource', {
        authenticated: req.isAuthenticated()
    });
});

router.get('/status', (req, res, next) => {
    res.render('status', {
        status: req
    });
});

router.get('/error', (req, res) => {
    res.render('error', {
        message_tag: 'Authentication Error'
    });
});

router.get('/logout', (req, res) => {
    req.logout(req.user, (err) => { // Passport logout function
        if (err) {
            res.redirect('/error');
        }
        res.redirect('/status');
        console.log("User Authenticated:", req.isAuthenticated());
    });
});

router.get('/login',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        accessType: 'offline', // Requests a refresh token
        prompt: 'consent'
    })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/error'
    }),
    (req, res) => {
        // Successful authentication, redirect to saved route or success.
        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        res.redirect(returnTo || '/success');
    });
  
    router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/error',
        keepSessionInfo: true // Used to keep session info on redirect
    }),
    (req, res) => {
        // Successful authentication, redirect to saved route or success.
        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        res.redirect(returnTo || '/success');
    });

module.exports = router;