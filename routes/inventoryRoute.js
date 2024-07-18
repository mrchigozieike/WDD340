const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');

router.get('/', utilities.handleErrors(invController.getInventory));
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryId));


router.get("/management", utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));


router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

router.get("/delete-confirm", utilities.handleErrors(invController.buildDeleteConfirm));
router.post("/delete-confirm", utilities.handleErrors(invController.deleteConfirm));

// New route to handle editing inventory by inventory_id
// This route will present a view to allow editing of the item's information
router.get('/edit/:inventory_id', utilities.handleErrors(invController.updateInventory));


router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
module.exports = router;