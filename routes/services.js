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

router.post('/createservice', async function(req, res, next) {
  try {
    const { service_name, is_enabled, initial_state_id } = req.body;

    const serviceId = uuidv4();

    const query = `
      INSERT INTO services (service_name, is_enabled, initial_state_id) VALUES ('${serviceId}','${service_name}', '${is_enabled}', '${initial_state_id}')
    `;

    await db.query(query); 

    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while getting service status:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/createstate', async function(req, res, next) {
  try {
    const { service_state_name, service_state_message, service_state_type, service_state_data_format, service_state_data_store, service_state_input_options } = req.body;

    const serviceStateId = uuidv4();

    const query = `
      INSERT INTO services (service_name, is_enabled, initial_state_id) VALUES ('${serviceId}','${service_name}', '${is_enabled}', '${initial_state_id}')
    `;

    await db.query(query); 

    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while getting service status:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/createresponse', async function(req, res, next) {
  try {
    const { service_name, is_enabled, initial_state_id } = req.body;

    const serviceId = uuidv4();

    const query = `
      INSERT INTO services (service_name, is_enabled, initial_state_id) VALUES ('${serviceId}','${service_name}', '${is_enabled}', '${initial_state_id}')
    `;

    await db.query(query); 

    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while getting service status:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/createcondition', async function(req, res, next) {
  try {
    const { service_name, is_enabled, initial_state_id } = req.body;

    const serviceId = uuidv4();

    const query = `
      INSERT INTO services (service_name, is_enabled, initial_state_id) VALUES ('${serviceId}','${service_name}', '${is_enabled}', '${initial_state_id}')
    `;

    await db.query(query); 

    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while getting service status:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/createapicall', async function(req, res, next) {
  try {
    const { service_name, is_enabled, initial_state_id } = req.body;

    const serviceId = uuidv4();

    const query = `
      INSERT INTO services (service_name, is_enabled, initial_state_id) VALUES ('${serviceId}','${service_name}', '${is_enabled}', '${initial_state_id}')
    `;

    await db.query(query); 

    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while getting service status:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;