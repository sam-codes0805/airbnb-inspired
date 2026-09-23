// Core Module
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

// External Module
const express = require('express');

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
// const { mongoCon } = require('./mongodb');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());
app.use(storeRouter);
app.use("/host", hostRouter);

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