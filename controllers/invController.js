const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};
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

invCont.buildManagement = async function (req, res, next) {

  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Management",
    nav,
    //errors: null,
  })
}

invCont.buildAddClassification = async function (req, res, next) {

  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    //errors: null,
  })
}

invCont.buildAddInventory = async function (req, res, next) {

  let nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    //errors: null,
  })
}

module.exports = invCont;
