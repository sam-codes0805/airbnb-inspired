const Home = require("../models/home");
const favHomes = require("../models/Fav");

exports.getIndex = (req, res, next) => {
  Home.fetchAll().then(data => {
    const registeredHomes = data;
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "Airbnb",
      currentPage: "index",
    })
  })
};

exports.getHomes = (req, res, next) => {
  Home.fetchAll().then(data => {
    const registeredHomes = data;
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
    })
  })
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
  })
};

exports.getHomeDetails = (req, res) => {
  const _id = req.params._id;
  // console.log("at home details page for _id: ", _id);
  Home.fetchById(_id).then(home => {
    res.render("store/home-detail", {
    pageTitle: "home details",
    currentPage: "homes",
    home: home
    })
  })
}

exports.getFavouriteList = (req, res, next) => {
  favHomes.getFavs((myFav) =>
    res.render("store/favourite-list", {
      registeredHomes: myFav,
      pageTitle: "My Favourites",
      currentPage: "favourites",
    })
  );
};

exports.postAddFav = (req, res, next) => {
  res.redirect('/favourites');
  favHomes.addFav(req.body._id);
  // console.log('home added to fav', req.body._id);
}

exports.postRemFav = (req, res) => {
  res.redirect('/favourites');
  favHomes.remFav(req.body._id);
}