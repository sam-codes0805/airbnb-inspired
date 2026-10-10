const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// jet-explode66@bravealias.com

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login Page",
    currentPage: 'login',
    isLoggedIn: false,
    errors: [],
  })
}

exports.postLogin = (req, res) => {

  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        return res.status(422).render("auth/login", {
          pageTitle: "Login Page",
          currentPage: 'login',
          isLoggedIn: false,
          errors: ["User does not exist."],
        })
      };

      bcrypt.compare(req.body.password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = {
              _id: user._id.toString(),
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              userType: user.userType,
            };
            req.session.userType = user.userType;
            return req.session.save(err => {
              if (err) console.error(err);
              res.redirect('/');
            });
            // res.redirect('/');      
          }
          else {
            res.render("auth/login", {
              pageTitle: "Login Page",
              currentPage: 'login',
              isLoggedIn: false,
              errors: ["Invalid Email or Password"],
            })
          }
        })
      }
    ).catch(err => {
      if (err) console.error(err)
      res.redirect('/login');
    })
  } 
      

  // req.session.isLoggedIn = true;

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  })
}

exports.getSignUp = (req, res) => {
  res.render("auth/sign-up", {
    pageTitle: "Sign Up",
    currentPage: 'sign-up',
    isLoggedIn: false,
    errors: [],
    oldInput: null
  });
}

exports.postSignUp = [

  check("firstname")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({min: 2})
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters")
  ,
  check("lastname")
    .trim()
    .isLength({min: 2})
    .withMessage("Last name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters")
  ,
  check("email")
    .isEmail()
    .withMessage("Please enter valid Email")
    .normalizeEmail()
  ,
  check("password")
    .trim()
    .isLength({min: 8, max: 16})
    .withMessage("Password must be of 8 - 16 characters")
    .matches(/^[A-Za-z0-9@$&_*]+$/)
    .withMessage("Password must contain - Uppercase, lowercase, number and a special character (@$&_*)")
  ,
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
  ,
  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["host", "guest"])
    .withMessage("Invalid User Type")
  ,
  check("terms")
    .notEmpty()  
    .withMessage("You must accept the terms and conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    })
  ,
  (req, res) => {
    const {firstname, lastname, email, password, userType, terms} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).render("auth/sign-up", {
        pageTitle: "Sign Up",
        currentPage: 'sign-up',
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: {firstname, lastname, email, password, userType, terms}
      });
    }

    
    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({firstname, lastname, email, password: hashedPassword, userType});
        return user.save();})
      .then(() => {
        res.redirect('/login');
      })
      .catch(err => {
        console.error(err);
        return res.status(422).render("auth/sign-up", {
        pageTitle: "Sign Up",
        currentPage: 'sign-up',
        isLoggedIn: false,
        errors: [err.message],
        oldInput: {firstname, lastname, email, password, userType, terms}
      });
      })
    
  }
]
