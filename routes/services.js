var express = require('express');
const soapRequest = require('../soap.js');
var router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const constants = require('../constants.js')
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid');

const db = require('../services/db.js')

router.get('/getservices', async (req, res, next) => {
    try {
        const rows = await db.query(constants.getServices());
        
        res.json(rows);
         
      } catch (err) {
        console.log(err)
        console.error('Error while getting services:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }

      return res;
  });

router.get('/getstates', async (req, res, next) => {
  try {
      const rows = await db.query(constants.getStates());
      
      res.json(rows);
        
    } catch (err) {
      console.log(err)
      console.error('Error while getting service states:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }

    return res;
});

router.get('/getresponses', async (req, res, next) => {
  try {
      const rows = await db.query(constants.getResponses());
      
      res.json(rows);
        
    } catch (err) {
      console.log(err)
      console.error('Error while getting service responses:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }

    return res;
});

router.get('/getconditions', async (req, res, next) => {
  try {
      const rows = await db.query(constants.getConditions());
      
      res.json(rows);
        
    } catch (err) {
      console.log(err)
      console.error('Error while getting service conditions:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }

    return res;
});

router.get('/getapicalls', async (req, res, next) => {
  try {
      const rows = await db.query(constants.getApiCalls());
      
      res.json(rows);
        
    } catch (err) {
      console.log(err)
      console.error('Error while getting service api calls:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }

    return res;
});

module.exports = router;