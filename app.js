// Core Module
const path = require('path');
const session = require('express-session');
const express = require('express');


// External Module
require('dotenv').config();
const mongoose = require('mongoose');
const mongoDbStore = require('connect-mongodb-session')(session);
const multer = require('multer');



//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require('./routes/authRouter');
const errorsController = require("./controllers/errors");


const rootDir = require("./utils/pathUtil");
// const { mongoCon } = require('./mongodb');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('photo'));

app.use(express.urlencoded());
app.use(express.static(path.join(rootDir, 'public')))
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/host/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/homes/uploads', express.static(path.join(rootDir, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new mongoDbStore({
  uri: process.env.MONGO_AIRBNBDB_URI,
  collection: 'sessions'
})


app.use(session({
  secret: 'Airbnb Private',
  resave: false,
  saveUninitialized: true,
  store
}));
app.use(storeRouter);

app.use("/host", (req, res, next) => {
  if(req.session.isLoggedIn && req.session.userType === 'host') {
    next();
  }else {
    res.redirect('/login');
  }
})
app.use("/host", hostRouter);
app.use(authRouter);


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