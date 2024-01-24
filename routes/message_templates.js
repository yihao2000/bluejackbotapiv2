var express = require("express");
const soapRequest = require("../soap.js");
var router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const constants = require("../constants.js");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

const db = require("../services/db.js");



router.get("/getMessageTemplates", async (req, res, next) => {
  try {
    const data = [];
    const rows = await db.query(constants.getTemplateMessages());
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const template_data = await db.query(constants.getTemplateMessageData(r.id));
      const map = new Map();
      template_data.forEach((t) => {
        map.set(t.data_name, t.data_type)
      })
      // console.log("THE MAP")
      // console.log(map)
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
      INSERT INTO message_templates VALUES ('${id}','${owner_id}' , '${content}', '${is_shared}', '${name}', '${category}')
    `;    
    let idx = 0;


    await db.query(query);

    if(map2.size > 0){
      let query2 = `INSERT INTO message_template_data (id, data_type, data_name) VALUES `;
      map2.forEach((value,key) => {
        query2 += `('${id}', '${value}','${key}')`
        if (idx < map2.length) {
          query+=','
        }
        idx++;
      });
      
      await db.query(query2)
    }

    res.json({ message: "Insert Successful !" });
  } catch (err) {
    console.log(err);
    console.error("Error inserting into message_template", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/removeMessageTemplate", async (req, res, next) => {
  try {
    const { id } = req.body;

    const query = `
      DELETE FROM message_templates WHERE id = '${id}'
    `;

    await db.query(query);

    res.json({ message: "Insert Successful !" });
  } catch (err) {
    console.log(err);
    console.error("Error inserting into message_template", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
