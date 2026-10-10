exports.pageNotFound = (req, res, next) => {
  res
    .status(404)
    .render("404", { pageTitle: "Page Not Found",
    user: req.session.user, currentPage: "404", isLoggedIn: req.session.isLoggedIn });
};
