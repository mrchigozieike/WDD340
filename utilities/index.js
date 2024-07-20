const invModel = require("../models/inventory-model")
const utilities = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
utilities.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
utilities.handleErrors = utilities => (req, res, next) => Promise.resolve(utilities(req, res, next)).catch(next)
utilities.handleErrors = (utilities) => (req, res, next) => { Promise.resolve(utilities(req, res, next)).catch(next) }

/* **************************************
* Build the classification view HTML
* ************************************ */
utilities.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<div class="divine">'
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h3>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h3>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
      grid += '</div>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
/* ************************
 * Build HTML for vehicle detail view
 ************************** */

// Function to build HTML view for a single inventory item detail
utilities.buildInventoryDetailView = function (vehicle) {
  let view = '';

  if (vehicle.length > 0) {
    view = '<ul class="veh-display">';
    vehicle.forEach(vehicle => {
      view += '<div class="vehicle-detail">';
      view += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-image">`;
      view += '</div>'; // close vehicle-detail
      view += '<div class="vehicle-detail-left">';
      view += `<h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
      view += '<div class="vehicle-pm">';
      view += `<h2>No Haggle-Price<sup>1</sup>:&nbsp; &nbsp; $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</h2>`;

      view += '<div class="vehicle-mp">';
      view += `<h5>MILAGE</h5>`;
      view += `<p>${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}<strong>miles</strong></p>`;

      view += '</div>'; // close vehicle-mp
      view += `<p class="estimate">ESTIMATE PAYMENTS</p>`;
      view += '</div>'; // close vehicle-pm
      view += '<div class="vehicle-name">';
      view += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
      view += '<div class="vehicle-info">';
      // Add a new section for buttons
      view += '<div class="vehicle-buttons">';
      view += '<button class="vehicle-buttons">START MY PURCHASE</button>';
      view += '<button class="vehicle-buttons">CONTACT US NOW</button>';
      view += '<button class="vehicle-buttons">SCHEDULE TEST DRIVE</button>';
      view += '<button class="vehicle-buttons">APPLY FOR FINANCING</button>';
      view += '</div>'; // close vehicle-buttons
      view += '</div>'; // close vehicle-info

      view += '<div class="vehicle-info">';
      view += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
      view += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
      view += '</div>'; // close vehicle-info      
      view += '</div>'; // close vehicle-
      view += `<p class="estimate"><strong>Call Us:<strong></p>`;
      view += `<p class="estimate"><strong>+2348063365400<strong></p>`;


    });

  }

  return view;
};

utilities.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


utilities.buildInventoryList = async function (inv_id = null) {
  let data = await invModel.getInventories()
  let inventoryList =
    '<select name="inv_id" id="inventoryList" required>'
  inventoryList += "<option value=''>Choose an Inventory Item</option>"
  data.rows.forEach((row) => {
    inventoryList += '<option value="' + row.inv_id + '"'
    if (
      inv_id != null &&
      row.inv_id == inv_id
    ) {
      inventoryList += " selected "
    }
    inventoryList += ">" + row.inv_make + " " + row.inv_model + " (" + row.inv_year + ")</option>"
  })
  inventoryList += "</select>"
  return inventoryList
}


/* ************************
 * Build HTML for vehicle detail view
 ************************** */

// Function to build HTML view for a single inventory item detail
utilities.buildVehicleDetails = function (vehicle) {
  let view = '';

  if (vehicle.length > 0) {
    view = '<ul class="veh-display">';
    vehicle.forEach(vehicle => {
      view += '<div class="vehicle-detail">';
      view += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-image">`;

      view += '</div>'; // close vehicle-detail


      view += '<div class="vehicle-detail-left">';
      view += `<h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
      view += '<div class="vehicle-pm">';
      view += `<h2><strong>No Haggle-Price<sup>1</sup>:&nbsp; &nbsp; $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</strong></h2>`;
      view += `<p><strong>Mileage</strong></p>`;
      view += '<div class="vehicle-mp">';




      view += `<p><strong>${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</strong></p>`;
      view += `<p>ESTIMATE PAYMENTS</p>`;
      view += '</div>'; // close vehicle-mp
      view += '</div>'; // close vehicle-pm

      view += '<div class="vehicle-name">';

      view += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
      view += '<div class="vehicle-info">';
      // Add a new section for buttons
      view += '<div class=vehicle-buttons">';

      view += '<button class="button">START MY PURCHASE</button>';
      view += '<button class="button">CONTACT US NOW</button>';
      view += '<button class="button">SCHEDULE TEST DRIVE</button>';
      view += '<button class="button">APPLY FOR FINANCING</button>';
      view += '</div>'; // close vehicle-buttons 


      view += '</div>'; // close vehicle-info
      view += '<div class="vehicle-info">';
      view += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
      view += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;

      view += '</div>'; // close vehicle-info
      view += '</div>'; // close vehicle-info


    });

  }

  return view;
};

/* ****************************************
* Middleware to check token validity
**************************************** */
utilities.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}



utilities.checkAuthorization = (req, res, next) => {
  if (res.locals.loggedin && 
    ((res.locals.accountData.account_type == "Admin")
    || (res.locals.accountData.account_type == "Employee"))) {
    next()  
  } else {
    req.flash('notice', 'Please, log in with an authorized account')
    return res.redirect("/account/login")
  }
 }

/**************
 * Build header Login/Logout
 *************/
utilities.getTools = (req) =>{
  if(req.cookies.jwt){
      try{
          const cookieData = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
          let html = `<p>Welcome,</p>
          <a title="Click to access account management" href="/account/">${cookieData.account_firstname}</a>
                      <a title="Click to log out" href="/account/logout">Log out</a>`;
          return html;
      }
      catch (error){
          throw new Error (error);
      }
  }
  else{
      let html = '<a title="Click to log in" href="/account/login">My account</a>';
      return html;
  }
}

/**************
* Authorization only to Employee and Admin accounts
*************/
utilities.authorizedAccounts = (req, res, next) =>{
  if(req.cookies.jwt){
      try{
          const cookieData = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
          if (cookieData.account_type == "Employee" || cookieData.account_type == "Admin"){
              next();
          }
          else{
              req.flash("notice", "Forbidden access");
              res.status(401).redirect("/account/login");
          }
      }
      catch (error){
          throw new Error (error);
      }
  }
  else{
      res.status(401).redirect("/account/login");
  }
}

module.exports = utilities;
