// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouriteList);
storeRouter.get("/homes/:_id", storeController.getHomeDetails);
storeRouter.post("/add-fav", storeController.postAddFav);
storeRouter.post("/rem-fav", storeController.postRemFav);

module.exports = storeRouter;
