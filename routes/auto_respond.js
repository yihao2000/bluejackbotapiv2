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
    } = req.body;
    const id = uuidv4();
    const query = `
      INSERT INTO auto_responses
        (id, name, trigger_type, trigger_words, trigger_recipients, response_message, is_enabled)
      VALUES (
        '${id}',
        '${name}',
        '${trigger_type}' ,
        '${trigger_words}',
        '${trigger_recipients}',
        '${response_message},
        '${is_enabled}')
    `;
    await db.query(query);
    res.json({ message: "Insert Successful !" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAutoResponses", async (req, res, next) => {
  try {
    const rows = await db.query(constants.getAutoResponses());
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
