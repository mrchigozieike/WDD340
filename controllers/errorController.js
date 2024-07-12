async function buildError(req, res, next) {
    let nav = await utilities.getNav()
    res.render("errors/error", {
      title: "Login",
      nav,
    })
  }