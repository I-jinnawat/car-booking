const express = require('express');
const {readdirSync} = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;
const moment = require('moment-timezone');

const connectDB = require('./Config/db');

global.error = null;
app.use(flash());
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(session({secret: 'secret', resave: true, saveUninitialized: true}));
// Set the timezone to Asia/Bangkok
moment.tz.setDefault('Asia/Bangkok');
//engine setup
app.set('Views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

//routes
readdirSync('./Routes').map(r => app.use('/', require('./Routes/' + r)));

// The connectDB function should be invoked before starting the server
connectDB()
  .then(
    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`)
    )
  )
  .catch(err => console.log(err));

module.exports = app;
