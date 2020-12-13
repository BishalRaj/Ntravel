"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");

router
  .get("/", (req, res) => {
    res.render("login");
  })
  .post("/login", (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/admin",
      failureRedirect: "/",
      failureFlash: true,
    })(req, res, next);
  })
  .get(
    "/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  )
  .get(
    "/google/redirect",
    passport.authenticate("google", {
      successRedirect: "/dashboard",
      failureRedirect: "/",
      failureFlash: true,
    })
  );

module.exports = router;
