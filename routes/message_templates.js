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
    const rows = await db.query(constants.getTemplateMessages());

    res.json(rows);
  } catch (err) {
    console.log(err);
    console.error("Error while getting linked classes:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/createmessagetemplate", async (req, res, next) => {
  try {
    const { name, content, category, data_map, owner_id, is_shared } = req.body;
    console.log(data_map)
    const id = uuidv4();

    // const query = `
    //   INSERT INTO message_templates VALUES ('${id}','${owner_id}' , '${content}', '${is_shared}', '${name}')
    // `;

    // let query2 = `INSERT INTO message_template_data VALUES `;
    // let idx = 0;
    // data_map.forEach((value,key) => {
    //   query2 += `('${id}', '${value}','${key}')`
    //   if (idx < data_map.length) {
    //     query+=','
    //   }
    //   idx++;
    // });

    await db.query(query);

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
