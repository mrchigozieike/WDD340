const pool = require("../database/")

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

async function addNewInventory( inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = `
      INSERT INTO inventory ( inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ( $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;
    const result = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Failed to add new inventory item.');
  }
}

module.exports = { addNewInventory, getClassifications, getInventoryByClassificationId, getInventoryById, addClassification };
