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



module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, addClassification };
