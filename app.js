require('dotenv').config();
const path = require('node:path');
const express = require('express');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const app = express();
const indexRouter = require('./routes/indexRouter');
const formRouter = require('./routes/formRouter');
const passport = require('passport');



app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(
  expressSession({
    cookie: {
      maxAge: 60 * 60 * 1000
    },
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 *1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

require('./config/passport');
app.use(passport.session());


app.use('/', indexRouter);
app.use('/form', formRouter);




app.listen(process.env.LOCALHOST_PORT_NUMBER, () => {
  console.log(`Listening on port ${process.env.LOCALHOST_PORT_NUMBER}`);
})