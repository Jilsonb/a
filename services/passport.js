// Get the configuration values
require('dotenv').config();
const User = require('../models/User');

const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

/*
 * After a successful authentication, store the user id in the session
 * as req.session.passport.user so that it persists across accesses.
 * See: https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
 * Here, since no database is used, the full user profile has to be stored in the session.
 */
passport.serializeUser((user, done) => {
    // Serialize a shorter version of the user profile
    // console.log('Serialiazing user:', user);
    done(null, user.id);
});

/*
* On each new access, retrieve the user profile from the session and provide it as req.user
* so that routes detect if there is a valid user context. 
*/
passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ _id: id });
    // console.log('Deserialiazing user:', user);
    done(null, user);
});

/*  Google AUTH  */

passport.use(
    new GoogleStrategy(
        // Strategy Parameters
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.REDIRECT_URL
            // proxy: true // Tell passport to trust the HTTPS proxy
        },
        // Verify callback
        async (accessToken, refreshToken, params, profile, done) => {
            // Check if user already exists in the database
            try {
                let thisUser = await User.findOne({ googleId: profile.id });
                if (thisUser) {
                    thisUser.accessToken = accessToken;
                    thisUser.expiryDate = expiryDate(params.expires_in)
                    await thisUser.save();
                    console.log('User already exists:', thisUser);
                } else {
                    // Create a new user
                    thisUser = await new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        accessToken: accessToken,
                        expiryDate: expiryDate(params.expires_in)
                    }).save();
                    console.log('New user:', thisUser);
                }
                done(null, thisUser);
            } catch (err) {
                console.error(err);
            }
        }
    ));

function expiryDate(seconds) {
    const date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    var newDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'long' }).format(date);
    return newDate;
}
