var express = require("express");
const soapRequest = require("../soap.js");
const router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const constants = require("../constants.js");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

const db = require("../services/db.js");

router.post("/createAutoRespond", async (req, res, next) => {
  try {
    const {
      name,
      trigger_recipients,
      trigger_type,
      trigger_words,
      response_message,
      is_enabled,
      owner_id
    } = req.body;

    const id = uuidv4();

    // Using prepared statements for security
    const query = `
      INSERT INTO auto_responses
        (id, name, trigger_type, trigger_words, trigger_recipients, response_message, is_enabled, owner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, name, trigger_type, trigger_words, trigger_recipients, response_message, is_enabled, owner_id];

    await db.query(query, values);

    res.json({ message: "Insert Successful !" });
  } catch (error) {
    console.error("Error in /createAutoRespond", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/updateAutoRespond", async (req, res, next) => {
  try {
    const {
      id,
      name,
      trigger_recipients,
      trigger_type,
      trigger_words,
      response_message,
      is_enabled,
      owner_id
    } = req.body;

    const query = `
      UPDATE auto_responses
      SET
        name = ?,
        trigger_type = ?,
        trigger_words = ?,
        trigger_recipients = ?,
        response_message = ?,
        is_enabled = ?,
        owner_id = ?
      WHERE id = ?
    `;
    const values = [name, trigger_type, trigger_words, trigger_recipients, response_message, is_enabled, owner_id, id];

    await db.query(query, values);

    res.json({ message: "Update Successful !" });
  } catch (error) {
    console.error("Error in /updateAutoRespond", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/getAutoResponses", async (req, res, next) => {
  try {
    const {
      owner_id,
    } = req.body;
    const rows = await db.query(constants.getAutoResponses(owner_id), [owner_id]);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/deleteAutoRespond', async function(req, res, next) {
  try {
    const { responseId } = req.body;
    const query = `DELETE FROM auto_responses WHERE id=?`;
    await db.query(query, [responseId]);

    res.json({ message: "Auto Response Deleted Successfully!" });
  } catch (err) {
    console.error('Error while deleting auto response:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
