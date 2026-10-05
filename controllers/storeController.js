const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  Home.find().then(data => {
    const registeredHomes = data;
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "Airbnb",
      currentPage: "index",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    })
  })
};

exports.getHomes = (req, res, next) => {
  Home.find().then(data => {
    const registeredHomes = data;
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      user: req.session.user,
      currentPage: "Home",
      isLoggedIn: req.session.isLoggedIn
    })
  })
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    user: req.session.user,
    currentPage: "bookings",
    isLoggedIn: req.session.isLoggedIn
  })
};

exports.getHomeDetails = (req, res) => {
  const _id = req.params._id;
  Home.findById(_id).then(home => {
    res.render("store/home-detail", {
    pageTitle: "home details",
    user: req.session.user,
    currentPage: "homes",
    home: home,
    isLoggedIn: req.session.isLoggedIn
    })
  })
}

exports.getFavouriteList = async (req, res, next) => {
 const user = await User.findById(req.session.user._id).populate('favorites');
 const myFav = user.favorites;
 
  res.render("store/favourite-list", {
    registeredHomes: myFav,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    user: req.session.user,
    isLoggedIn: req.session.isLoggedIn
  })
};

exports.postAddFav = async (req, res, next) => {
  const homeId = req.body._id;
  const user = await User.findById(req.session.user._id);
  if(!user.favorites.includes(homeId)) {
    user.favorites.push(homeId);
    await user.save();
  }
  res.redirect('/favourites')
}

exports.postRemFav = async (req, res) => {
  const homeId = req.body._id;
  const user = await User.findById(req.session.user._id);
  if(user.favorites.includes(homeId)) {
    user.favorites.pull(homeId);
    await user.save();
  }
  console.log("removed from fav list");
  res.redirect('/favourites');
}