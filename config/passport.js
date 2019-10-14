//Import Libraries
const passport = require('passport');//Using Module passport for authentication of user
const Strategy = require('passport-local').Strategy; //Using passport-local strateg of passport 

//Import Files
const User = require('../models/user');//Invoking user.js model
const Admin = require('../models/admin');//Invoking user.js model



//Using passport strategy user
passport.use('user', new Strategy(function (username, password, done) {
    //compare username if same return user else return false
    User.findOne({ username: username }, function (err, user) {
        if (err) return done(err);
        if (!user) {
            return done(null, false);
        }
        if (!user.comparePassword(password)) {
            return done(null, false);
        }
        return done(null, user);
    });
}));

//Using passport strategy admin
passport.use('admin', new Strategy(function (username, password, done) {
    //compare username if same return user else return false
    Admin.findOne({ username: username }, function (err, user) {
        if (err) return done(err);
        if (!user) {
            return done(null, false);
        }
        if (!user.comparePassword(password)) {
            return done(null, false);
        }
        return done(null, user);
    });
}));

//passport Serialization
passport.serializeUser(function (user, done) {
    done(null, user._id); //serializing the id's of user or admin
});


//passport Deserialize
passport.deserializeUser(function (id, done) {

    User.findById(id, function (err, user) {//find the user by id

        if (err) return done(err);

        if (user) {
            done(null, user); //return user
        }
        else { //else will call when no user return 
            Admin.findById(id, function (err, admin) {//find the google users by id 

                if (err) return done(err);

                if (admin) {
                    done(null, admin); //return google user
                }
            })

        }
    })

});

module.exports = passport;//return the passport.js to other node.js files
