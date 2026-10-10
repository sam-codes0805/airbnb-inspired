const Home = require("../models/home");
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

exports.getAddHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    user: req.session.user,
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then(data => {
    const registeredHomes = data;
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      user: req.session.user,
      currentPage: "host-homes",
      isLoggedIn: req.session.isLoggedIn
    })
  })
};

exports.postAddHome = (req, res) => {
  const { housename, price, location, rating, desc } = req.body;
  const photo = req.file ? req.file.filename : null;

  const home = new Home({housename, price, location, rating, photo, desc});
  home.save().then(() => {
    console.log("home saved successfully");
  })

  res.render("host/home-added", {
    pageTitle: "Home Added Successfully",
    user: req.session.user,
    currentPage: "homeAdded",
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postEditHome = (req, res) => {
  Home.findById(req.body._id).then(Home => {
    res.render("host/edit-home", {
    pageTitle: "edit Home",
    currentPage: 'host-homes',
    user: req.session.user,
    Home: Home,
    isLoggedIn: req.session.isLoggedIn
    }
  )})
}

exports.postHomeEdited = (req, res) => {
  const { _id, housename, price, location, rating, desc} = req.body;
  const photo = req.file ? req.file.filename : null;
  console.log(housename);
  Home.findById(_id).then((home) => {
    if(!home){
      console.log('home not found to edit');
      res.redirect("host/host-homes");
    }
    home.housename = housename;
    home.price = price;
    home.location = location;
    home.rating = rating;
    if(photo) {
      fs.unlink(path.join(rootDir, 'uploads', home.photo), (err) => {
        if(err) {
          console.log('error while deleting photo', err);
        }else console.log('photo deleted successfully');
      })
      home.photo = photo;
    }
    home.desc = desc;

    return home.save();
  }).then(() => {
    res.redirect('/host/host-home-list');
  }).catch(err => {
    console.log('error while updating home', err);
  })
}

exports.postDeleteHome = async (req, res) => {
    await Home.findByIdAndDelete(req.body._id).then(() => {
      console.log('home deleted');
    });
    res.redirect('/host/host-home-list');
}