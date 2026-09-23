const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then(data => {
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
  const home = new Home({housename, price, location, rating, photourl});
  home.save().then(() => {
    console.log("home saved successfully");
  })

  res.render("host/home-added", {
    pageTitle: "Home Added Successfully",
    currentPage: "homeAdded",
  });
};

exports.postEditHome = (req, res) => {
  Home.findById(req.body._id).then(Home => {
    res.render("host/edit-home", {
    pageTitle: "edit Home",
    currentPage: 'host-homes',
    Home: Home
    }
  )})
}

exports.postHomeEdited = (req, res) => {
  const { _id, housename, price, location, rating, photourl } = req.body;
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
    home.photourl = photourl;

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