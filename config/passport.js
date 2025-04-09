const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const prisma = require('../db/client');


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const users = await prisma.users.findMany({
        where: {
          username: username,
        }
      });
      const user = users[0];
      if(!user) {
        return done(null, false, {message: "Incorrect username"});
      }
      // if(user.hash !== password) {
      //   return done(null, false, {message: 'Incorrect password'});
      // }
      const match = await bcrypt.compare(password, user.hash);
      if(!match) {
        return done(null, false, {message: "Incorrect password"});
      }

      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {

    const rows = await prisma.users.findMany({
      where: {
        id: id,
      }
    });
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});