const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId; // Assuming inventoryId is passed as a route parameter
  try {
    const inventoryItem = await invModel.getInventoryById(inventory_id); // Fetch inventory item details
    console.log(inventoryItem)
    if (!inventoryItem) {
      // Handle case where inventory item is not found
      return res.status(404).send("Inventory item not found.");
    }

    // Example function to build a detailed view for an inventory item
    const detailedView = utilities.buildInventoryDetailView(inventoryItem);

    let nav = await utilities.getNav(); // Get navigation links or data

    // Example: Render a detailed view template with inventory details
    res.render("./inventory/details", {
      title: inventoryItem.inv_make, // Example title using inventory item name
      nav,
      detailedView,
    });
  } catch (err) {
    // Handle errors, e.g., database query errors
    console.error("Error fetching inventory item:", err);
    res.status(500).send("Error fetching inventory item details.");
  }
};


/* **************************************
 * Get all the information of the car requested
 * ************************************ */

async function getVehicleDetails(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
          WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getinventorybyid error " + error);
  }
}

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getVehicleDetails(inv_id)
  const grid = await utilities.buildVehicleDetails(data)
  let nav = await utilities.getNav()
  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/details", {
    title: className,
    nav,
    grid,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const clasificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    clasificationSelect
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,

  })
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null
  })
}

invCont.buildDeleteConfirm = async function (req, res, next) {
  let nav = await utilities.getNav()
  
  res.render("./inventory/delete-confirm", {
    title: "Delete Vehicle",
    nav,
    
  })
}
/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const data = await invModel.getVehicleDetails(inv_id)
  const itemData = data[0];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}


/* ****************************************
*  Process Classification
* *************************************** */
invCont.addClassification = async function (req, res, next){
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addClassificationResult = await invModel.addClassification(
   classification_name
  )

  if (addClassificationResult) {
    req.flash(
      "notice",
      `The newcar classification ${classification_name} was succesfully aded.`)
    res.status(201).render("inventory/add-classification", {
      title: "Add new Vehicle Classification",
      nav,
    
    })
  } else {
    req.flash("notice", "Provide a correct clasification name.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      clasificationSelect
    })
  }
}

/* ****************************************
*  Add new vehicle to Inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body


  const addInventoryResult = await invModel.addInventory(
    classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  )

  const inventorySelect = await utilities.buildClassificationList()

  if (addInventoryResult) {
    req.flash(
      "notice",
      `The new vehicle was succesfully aded.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      inventorySelect
    });
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added. Please try again.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      inventorySelect
    })
  }
}



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId);
  let nav = await utilities.getNav();

  const itemData = await invModel.getVehicleDetails(inv_id); // Fetch inventory item data
  const item = itemData[0]; // Assuming getVehicleDetails returns an array

  const classificationSelect = await utilities.buildClassificationList(item.classification_id);
  const itemName = `${item.inv_make} ${item.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: item.inv_id,
    inv_make: item.inv_make,
    inv_model: item.inv_model,
    inv_year: item.inv_year,
    inv_description: item.inv_description,
    inv_image: item.inv_image,
    inv_thumbnail: item.inv_thumbnail,
    inv_price: item.inv_price,
    inv_miles: item.inv_miles,
    inv_color: item.inv_color,
    classification_id: item.classification_id
  });
}

/* ***************************
 *  Build delete inventory confirmation view
 * ************************** */
invCont.buildDeleteConfirmView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  if (itemData.length > 0) {
    const item = itemData[0];
    const itemName = `${item.inv_make} ${item.inv_model}`;
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: item.inv_id,
      inv_make: item.inv_make,
      inv_model: item.inv_model,
      inv_year: item.inv_year,
      inv_description: item.inv_description,
      inv_image: item.inv_image,
      inv_thumbnail: item.inv_thumbnail,
      inv_price: item.inv_price,
      inv_miles: item.inv_miles,
      inv_color: item.inv_color,
      classification_id: item.classification_id
    });
  } else {
    req.flash("notice", "Sorry, the inventory item could not be found.");
    res.redirect("/inv/management");
  }
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id); // Assuming the ID is sent in the request body
  let nav = await utilities.getNav();

  const deleteResult = await invModel.deleteInventoryById(inv_id);

  if (deleteResult) {
    req.flash("notice", "The vehicle was successfully deleted.");
    res.redirect("/inv/management");
  } else {
    req.flash("notice", "Sorry, the vehicle could not be deleted.");
    res.redirect("/inv/management");
  }
};


module.exports = invCont;