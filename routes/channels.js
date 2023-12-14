var express = require('express');
const soapRequest = require('../soap.js');
var router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const constants = require('../constants.js')
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid');

const db = require('../services/db.js')

router.get('/getchannels', async (req, res, next) => {
    try {
        console.log(constants.getChannels())
        const rows = await db.query(constants.getChannels(), null);
        
        res.json(rows);
         
      } catch (err) {
        console.log(err)
        console.error('Error while getting linked classes:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });


  router.post('/createchannel', async function(req, res, next) {
    try {
      const { channelName, channelDescription } = req.body;

      const channelId = uuidv4();

      const query = `
        INSERT INTO channels VALUES ('${channelId}','${channelName}' , '${channelDescription}')
      `;
  
      await db.query(query); 

  
      res.json({message: "Insert Successful !"});
       
    } catch (err) {
      console.log(err)
      console.error('Error while getting class link status:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



module.exports = router;
