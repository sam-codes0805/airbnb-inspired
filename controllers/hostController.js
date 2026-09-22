const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll().then(data => {
    const registeredHomes = data;
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
    })
  })
};

exports.postAddHome = (req, res) => {
  const { housename, price, location, rating, photourl } = req.body;
  const home = new Home(housename, price, location, rating, photourl);
  home.save().then(() => {
    console.log("home saved successfully")
  })

  res.render("host/home-added", {
    pageTitle: "Home Added Successfully",
    currentPage: "homeAdded",
  });
};

exports.postEditHome = (req, res) => {
  Home.fetchById(req.body._id).then(Home => {
    res.render("host/edit-home", {
    pageTitle: "edit Home",
    currentPage: 'host-homes',
    Home: Home
    }
  )})
}

exports.postHomeEdited = (req, res) => {
  Home.editDetail(req.body);
  res.redirect('/host/host-home-list');
}

exports.postDeleteHome = (req, res) => {
    Home.remHome(req.body._id);
    res.redirect('/host/host-home-list');
}