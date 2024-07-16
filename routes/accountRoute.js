const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');


/* ****************************************
*  Deliver login view
* *************************************** */
router.get(
    "/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.buildLogin))


router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post("/register", utilities.handleErrors(accountController.registerAccount))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
module.exports = router;