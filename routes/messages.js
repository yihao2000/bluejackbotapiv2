var express = require('express');
const soapRequest = require('../soap.js');
var router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const constants = require('../constants.js')
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid');

const db = require('../services/db.js')

router.post('/getscheduledmessages', async (req, res, next) => {
    try {
        const { owner_id } = req.body;

        const rows = await db.query(constants.getScheduledMessages(), [owner_id]);
        
        res.json(rows);
         
      } catch (err) {
        console.log(err)
        console.error('Error while getting linked classes:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });

  router.post('/removescheduledmessage', async (req, res, next) => {
    try {

      const { id } = req.body;


      const query = `
        DELETE FROM scheduled_messages WHERE id = '${id}'
      `;
  
      await db.query(query); 

      res.json({message: "Scheduled message successfully removed !"});
         
      } catch (err) {
        console.log(err)
        console.error('Error while getting linked classes:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });


module.exports = router;
