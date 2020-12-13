const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../model/usermodel");
const keys = require("./keys");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // match user
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Invalid user" });
          }

          // check password
          bcrypt.compare(password.toString(), user.password, (err, isMatch) => {
            if (err) {
              return done(null, false, {
                message: "Invalid credentials. Please try again!",
              });
            }

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // match user
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Email is not registered" });
          }

          // check password
          bcrypt.compare(password.toString(), user.password, (err, isMatch) => {
            // if (err) throw err;
            if (err) {
              return done(null, false, {
                message: "Invalid credentials. Please try again!",
              });
            }

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        callbackURL: "/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
      },
      (accessToken, refreshToken, profile, done) => {
        // passport callback function

        User.findOne({ googleId: profile.id }).then((currentUser) => {
          if (!currentUser) {
            // if not registered-create new user
            new User({
              name: profile._json.name,
              email: profile._json.email,
              googleId: profile.id,
              thumbnail: profile._json.picture,
              // googleId: profile._json.sub,  //for google id from JSON
            })
              .save()
              .then((newUser) => {
                return done(null, newUser);
                // console.log("new user created: " + newUser);
              });
          } else {
            return done(null, currentUser);
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
