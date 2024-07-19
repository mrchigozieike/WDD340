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



// New route to handle deleting inventory by inventory_id
router.post('/delete/:invId', utilities.handleErrors(invController.deleteInventory));

// New route to handle editing inventory by inventory_id
router.get('/edit/:invId', utilities.handleErrors(invController.editInventoryView));

//router.get("/delete-confirm", utilities.handleErrors(invController.buildDeleteConfirm));
//router.post("/delete-confirm", utilities.handleErrors(invController.deleteConfirm));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
module.exports = router;