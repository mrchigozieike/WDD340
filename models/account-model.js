const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');

router.get('/', utilities.handleErrors(buildLogin));


/* ****************************************
 * Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav(); // Assuming you have a function to get navigation data
  res.render('account/login', {
    title: 'Login',
    nav,
  });
}



/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}
module.exports = router;
