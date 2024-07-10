const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');

router.get('/', utilities.handleErrors(invController.getInventory));
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryId));


router.get("/management", utilities.handleErrors(invController.buildManagement));

module.exports = router;