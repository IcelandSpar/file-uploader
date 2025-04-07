require('dotenv').config();
const path = require('node:path');
const express = require('express');
const app = express();
const indexRouter = require('./routes/indexRouter');
const formRouter = require('./routes/formRouter');


app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

app.use('/', indexRouter);
app.use('/form', formRouter);




app.listen(process.env.LOCALHOST_PORT_NUMBER, () => {
  console.log(`Listening on port ${process.env.LOCALHOST_PORT_NUMBER}`);
})