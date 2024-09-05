const pool = require("../database/")

// Update the classification status
async function updateClassificationStatus(classification_id, status) {
  try {
    const query = 'UPDATE public.classification SET approved = $1 WHERE classification_id = $2 RETURNING *';
    const result = await pool.query(query, [status, classification_id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating classification status:', error);
    throw new Error('Database query failed');
  }
}

// Update the inventory status
async function updateInventoryStatus(inv_id, status) {
  try {
    const query = 'UPDATE public.inventory SET status = $1 WHERE inv_id = $2 RETURNING *';
    const result = await pool.query(query, [status, inv_id]);
    console.log(result)
    return result.rows[0];
  } catch (error) {
    console.error('Error updating inventory status:', error);
    throw new Error('Database query failed');
  }
}


// Method to get unapproved classifications
async function getUnapprovedClassifications() {
  const query = 'SELECT * FROM public.classification WHERE status = Unapproved ORDER BY classification_name';
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw new Error('Database query failed');
  }
};

// Method to get unapproved inventory items
async function getUnapprovedInventories() {
  const query = 'SELECT * FROM public.inventory WHERE status = Unapproved  ORDER BY inv_make, inv_model';
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw new Error('Database query failed');
  }
};




/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
    
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


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





/* ***************************
 *  Get inventory item by id
 * ************************** */
async function getInventoryById(inventoryId) {
  try {
    const data = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1',
      [inventoryId]
    );
    return data.rows;
  } catch (error) {
    console.error('getInventoryById error ' + error);
  }
}


/* *****************************
*   add new classification
* *************************** */
async function addClassification(classification_id){
  try {
    const sql = "INSERT INTO classification (classification_id) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [classification_id])
  } catch (error) {
    return error.message
  }
}

/* Add new Vehicle function*/

async function addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryById(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {updateClassificationStatus, getUnapprovedClassifications, getUnapprovedInventories, getVehicleDetails, updateInventory, deleteInventoryById, addInventory, getClassifications, getInventoryByClassificationId, getInventoryById, addClassification };
