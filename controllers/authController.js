const { check } = require("express-validator");


exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login Page",
    currentPage: 'login',
    isLoggedIn: false
  })
}

exports.postLogin = (req, res) => {
  console.log(req.body);
  req.session.isLoggedIn = true;
  res.redirect('/');
}

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
    oldInput: {firstName: "", lastName: "", email: "", userType: ""}
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
    .isIn(["admin", "guest"])
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
    const {firstname, lastname, email, password, userType} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).render("auth/sign-up", {
        pageTitle: "Sign Up",
        currentPage: 'sign-up',
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: {firstname, lastname, email, password, userType}
      });
    }
    res.redirect('/login');
  }
]
