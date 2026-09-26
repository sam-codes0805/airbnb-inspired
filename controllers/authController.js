

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