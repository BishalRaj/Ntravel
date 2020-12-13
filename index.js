const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

require("./config/connection");
require("./config/passport")(passport);

app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/img", express.static(__dirname + "/public/images"));
app.use(
  session({
    secret: require("./config/keys").secret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

const indexController = require("./controller/index");

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/", indexController);

//error handling

app.use((error, req, res, next) => {
  console.log(error);
});

module.exports = app;
