const Home = require("../models/home");
const fav = require("../models/Fav");

exports.getIndex = (req, res, next) => {
  Home.find().then(data => {
    const registeredHomes = data;
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "Airbnb",
      currentPage: "index",
    })
  })
};

exports.getHomes = (req, res, next) => {
  Home.find().then(data => {
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
  Home.findById(_id).then(home => {
    res.render("store/home-detail", {
    pageTitle: "home details",
    currentPage: "homes",
    home: home
    })
  })
}

exports.getFavouriteList = (req, res, next) => {
  fav.find()
  .populate('homeId')
  .then((favourites => {
    const myFav = favourites.map(fav => fav.homeId);
    res.render("store/favourite-list", {
      registeredHomes: myFav,
      pageTitle: "My Favourites",
      currentPage: "favourites",  
    })
  }))
};

exports.postAddFav = (req, res, next) => {
  const homeId = req.body._id;;
  const Fav = new fav({homeId});
  Fav.save().then(() => {
    res.redirect('/favourites');
  }).catch(err => {
    console.log('home already added')
    res.redirect('/favourites')
  })
  // console.log('home added to fav', req.body._id);
}

exports.postRemFav = (req, res) => {
  const homeId = req.body._id;
  console.log(homeId);
  fav.findOneAndDelete({homeId: homeId}).then(() => {
    res.redirect('/favourites');
  })
}