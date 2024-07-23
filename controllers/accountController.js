const accountModel = require('../models/account-model');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const pool = require("../database/");
const utilities = require('../utilities/');
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
      let nav = await utilities.getNav();
      res.render("account/login", {
          title: "Login",
          nav,
          errors: null,
      });
  } catch (error) {
      next(error);
  }
}

/* ****************************************
 *  Deliver management view
 * *************************************** */
async function buildManagement(req, res, next) {
  try {
      let nav = await utilities.getNav();
      res.render("account/account-management", {
          title: "Account Management",
          nav,
          errors: null,
      });
  } catch (error) {
      next(error);
  }
}


/* ****************************************
 *  Deliver Update Account view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
    try {
        let nav = await utilities.getNav();
        res.render("account/update", {
            title: "Edit Account",
            nav,
            errors: null,
        });
    } catch (error) {
        next(error);
    }
}


/* ****************************************
 *  Deliver Update Account view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  try {
      let nav = await utilities.getNav();
      res.render("account/update", {
          title: "Edit Account",
          nav,
          errors: null,
      });
  } catch (error) {
      next(error);
  }
}


/* ****************************************
 *  Registration view Delivery
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
      let nav = await utilities.getNav();
      res.render("account/register", {
          title: "Register",
          nav,
          errors: null,
      });
  } catch (error) {
      next(error);
  }
}

/* ****************************************
 *  Process Update Account
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;

  const regResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
  );

  if (regResult) {
      const newAccountData = await accountModel.getAccountById(account_id);
      // adding new data to the session
      req.session.user = {
          name: newAccountData.account_firstname,
          userType: req.session.user.userType,
          userId: newAccountData.account_id
      };
      req.flash(
          "notice",
          `Congratulations, your information has been updated.`
      );
      res.status(201).render("account/account-management", {
          title: "Account Management",
          nav,
          errors: null,
          //using update data to render the view
          user: req.session.user
      });
  } else {
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("account/update", {
          title: "Edit Account",
          nav,
          errors: null,
          account_firstname,
          account_lastname,
          account_email
      });
  }
}

/* ****************************************
*  Process Update Password
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the password updating.');
      res.status(500).render("account/update", {
          title: "Edit Account",
          nav,
          errors: null,
      });
      return;
  }

  const regResult = await accountModel.updatePassword(
      hashedPassword,
      account_id
  );

  if (regResult) {
      req.flash(
          "notice",
          `Congratulations, your information has been updated.`
      );
      res.status(201).render("account/account-management", {
          title: "Account Management",
          nav,
          errors: null,
      });
  } else {
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("account/update", {
          title: "Edit Account",
          nav,
          errors: null,
      });
  }
}

/* ****************************************
 * Handle Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Check if email already exists
    const existingEmail = await checkExistingEmail(account_email);
    if (existingEmail) {
      req.flash('error', 'Email already in use');
      return res.redirect('/register');
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(account_password);

    // Save the new account
    await pool.query(
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client')",
      [account_firstname, account_lastname, account_email, hashedPassword]
    );

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/account/login');
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 * Handle Logout
 * *************************************** */
async function accountLogout(req, res, next) {
  req.flash('success', 'Logged out successfully!');
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    
    res.redirect('/account/login');
  });
}

/* ****************************************
 * Deliver Account Management View
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav(); // Assuming you have a function to get navigation data
  res.render('account/management', {
    title: 'Account Management',
    nav,
  });
}

/* ****************************************
 * Hash password
 * *************************************** */
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

/* ****************************************
 * Check for existing email
 * *************************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount > 0;
  } catch (error) {
    throw new Error('Error checking existing email');
  }
}

/* ****************************************
 * Get account data using email address
 * *************************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('No matching email found');
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
      });
      return;
  }
  try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
          delete accountData.account_password;
          const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
          if (process.env.NODE_ENV === 'development') {
              res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
          } else {
              res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
          }
          //getting user name, type and Id to use on header, form and authorization
          req.session.user = {
              name: accountData.account_firstname,
              userType: accountData.account_type,
              userId: accountData.account_id
          };
          return res.redirect("/account/");
      }
  } catch (error) {
      req.flash("notice", "Access Forbidden");
      res.status(403).redirect("/account/login");
  }
}





module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, accountLogout, buildAccountManagement, updateAccount, updatePassword }