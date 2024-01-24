var express = require("express");
const soapRequest = require("../soap.js");
var router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const constants = require("../constants.js");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

const db = require("../services/db.js");



router.post("/getMessageTemplates", async (req, res, next) => {
  try {
    const {
      owner_id,
    } = req.body;
    const data = [];
    const rows = await db.query(constants.getTemplateMessages(), [owner_id]);
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const template_data = await db.query(constants.getTemplateMessageData(r.id));
      const map = new Map();
      template_data.forEach((t) => {
        map.set(t.data_name, t.data_type)
      })
      data.push({
        ...r,
        data_map: Object.fromEntries(map)
      })
      
    }
    console.log(data)
    res.json(data);
  } catch (err) {
    console.log(err);
    console.error("Error while getting linked classes:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/createmessagetemplate", async (req, res, next) => {
  try {
    const { name, content, category, data_map, owner_id, is_shared } = req.body;


    const map2 = new Map(Object.entries(data_map));
    const id = uuidv4();

    const query = `
      INSERT INTO message_templates (template_id, template_owner_id, template_raw_content, template_is_shared, template_name, template_category) VALUES ('${id}','${owner_id}' , '${content}', '${is_shared}', '${name}', '${category}')
    `;    
    let idx = 0;

    await db.query(query);
    res.json({ message: "Insert Successful!" });
  } catch (err) {
    console.log(err);
    console.error("Error inserting into message_template", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/updatemessagetemplate", async (req, res, next) => {
  try {
    const { id, name, content, category, owner_id, is_shared } = req.body;

    const query = `
      UPDATE message_templates
      SET template_owner_id = ?, 
          template_raw_content = ?, 
          template_is_shared = ?, 
          template_name = ?, 
          template_category = ?
      WHERE template_id = ?
    `;
    const values = [owner_id, content, is_shared, name, category, id];

    await db.query(query, values);

    res.json({ message: "Update Successful!" });
  } catch (err) {
    console.error("Error updating message_template", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/removeMessageTemplate", async (req, res, next) => {
  try {
    const { templateId } = req.body;

    const query = `
      DELETE FROM message_templates WHERE template_id = '${templateId}'
    `;

    await db.query(query);

    res.json({ message: "Delete successful!" });
  } catch (err) {
    console.log(err);
    console.error("Error deleting from message_template", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
