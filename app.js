// Core Module
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const mongoDbStore = require('connect-mongodb-session')(session);

// External Module
const express = require('express');


//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require('./routes/authRouter');
const errorsController = require("./controllers/errors");


const rootDir = require("./utils/pathUtil");
// const { mongoCon } = require('./mongodb');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new mongoDbStore({
  uri: process.env.MONGO_AIRBNBDB_URI,
  collection: 'sessions'
})

app.use(express.urlencoded());

app.use(session({
  secret: 'Airbnb Private',
  resave: false,
  saveUninitialized: true,
  store
}));
app.use(storeRouter);

app.use("/host", (req, res, next) => {
  if(!req.session.isLoggedIn){
    console.log(req.session);
    res.redirect('/login');
  }else{
    console.log(req.session);
    next();
  }
})
app.use("/host", hostRouter);
app.use(authRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);

const PORT = 5173;

mongoose.connect(process.env.MONGO_AIRBNBDB_URI).then(() => {
  console.log("MongoDB Connected Successfully")
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log("error connecting to mongo!", err);
})