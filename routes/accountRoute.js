// Needed Resources 
const express = require("express") // Brings express into scope.
const router = new express.Router() // Using express we create a new router object.
const accountController = require("../controllers/accountController") // Brings the invController into scope.
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')


// Index route
//app.get("/", utilities.handleErrors(baseController.buildHome))

// Route to build Default Account View
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Route to build Login
router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get('/logout', utilities.handleErrors(accountController.accountLogout))
router.get("/edit", utilities.handleErrors(accountController.buildAccountManagement))

router.get("/account", utilities.handleErrors(accountController.buildAccountManagement))

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Deliver Account Management View
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));


//Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)


// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

// Process the update account data
router.post(
    "/updateAccount",
    regValidate.updateAccountRules(),
    regValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccount)
);


// Process the update password data
router.post(
    "/updatePassword",
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePasswordData,
    utilities.handleErrors(accountController.updatePassword)
);

router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post("/register", utilities.handleErrors(accountController.registerAccount))
router.get("/", utilities.handleErrors(accountController.buildManagement))


module.exports = router;