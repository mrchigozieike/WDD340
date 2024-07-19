// Needed Resources 
const express = require("express") // Brings express into scope.
const router = new express.Router() // Using express we create a new router object.
const accountController = require("../controllers/accountController") // Brings the invController into scope.
const Util = require('../utilities/')
const regValidate = require('../utilities/account-validation')

// Route to build Default Account View
router.get("/register", Util.handleErrors(accountController.buildRegister))
// Route to check Login
router.get("/", Util.checkLogin, Util.handleErrors(accountController.buildManagement))

router.get('/logout', Util.handleErrors(accountController.accountLogout))
router.get("/edit", Util.checkLogin, Util.handleErrors(accountController.buildAccountManagement))

//Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    Util.handleErrors(accountController.registerAccount)
)


// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    Util.handleErrors(accountController.accountLogin))

router.get("/register", Util.handleErrors(accountController.buildRegister))
router.post("/register", Util.handleErrors(accountController.registerAccount))
router.get("/", Util.checkLogin, Util.handleErrors(accountController.buildManagement))


module.exports = router;