// External Module
const express = require("express");
const hostRouter = express.Router();

// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post("/edit-home/edited", hostController.postHomeEdited);
hostRouter.post("/deleteHome", hostController.postDeleteHome);
module.exports = hostRouter;
