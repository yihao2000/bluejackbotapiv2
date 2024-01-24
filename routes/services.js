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
    const { service_name = '', is_enabled = '', initial_state_id = ''} = req.body;
    const serviceId = uuidv4();

    const query = `
      INSERT INTO services (service_id, service_name, is_enabled, initial_state_id) VALUES (?, ?, ?, ?)
    `;
    await db.query(query, [serviceId, service_name, is_enabled, initial_state_id]);


    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while getting service status:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/createstate', async function(req, res, next) {
  try {
    const { service_state_name = '', service_state_message = '', service_state_type = '', service_state_data_format = '', service_state_data_store = '', service_state_input_options = ''} = req.body;
    const serviceStateId = uuidv4();

    const query = `
      INSERT INTO service_states (service_state_id, service_state_name, service_state_message, service_state_type, service_state_data_format, service_state_data_store, service_state_input_options)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [serviceStateId, service_state_name, service_state_message, service_state_type, service_state_data_format, service_state_data_store, service_state_input_options]);
    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while creating service state:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/createresponse', async function(req, res, next) {
  try {
    const { service_response_name = '', service_response_condition_id = '', service_response_condition_value = '', service_response_type = '', service_response_value = '', service_response_state_id = ''} = req.body;
    const serviceResponseId = uuidv4();

    const query = `
      INSERT INTO service_responses (service_response_id, service_response_name, service_response_condition_id, service_response_condition_value, service_response_type, service_response_value, service_response_state_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [serviceResponseId, service_response_name, service_response_condition_id, service_response_condition_value, service_response_type, service_response_value, service_response_state_id]);
    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while creating service response:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/createcondition', async function(req, res, next) {
  try {
    const { service_condition_name = '', service_condition_type = '', service_condition_value = ''} = req.body;
    const serviceConditionId = uuidv4();

    const query = `
      INSERT INTO service_conditions (service_condition_id, service_condition_name, service_condition_type, service_condition_value)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(query, [serviceConditionId, service_condition_name, service_condition_type, service_condition_value]);
    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while creating service condition:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/createapicall', async function(req, res, next) {
  try {
    const { api_endpoint = '', http_method = '', payload = ''} = req.body;
    const serviceApiCallId = uuidv4();

    const query = `
      INSERT INTO service_api_calls (service_api_call_id, api_endpoint, http_method, payload)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(query, [serviceApiCallId, api_endpoint, http_method, payload]);
    res.json({message: "Insert Successful!"});
     
  } catch (err) {
    console.error('Error while creating service API call:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/updateservice', async function(req, res, next) {
  try {
    const { service_id = '', service_name = '', is_enabled = '', initial_state_id = ''} = req.body;
    const query = `
      UPDATE services SET service_name=?, is_enabled=?, initial_state_id=? WHERE service_id=?
    `;
    await db.query(query, [service_name, is_enabled, initial_state_id, service_id]);

    res.json({ message: "Update Successful!" });
  } catch (err) {
    console.error('Error while updating service:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/updatestate', async function(req, res, next) {
  try {
    const { service_state_id = '', service_state_name = '', service_state_message = '', service_state_type = '', service_state_data_format = '', service_state_data_store = '', service_state_input_options = ''} = req.body;
    const query = `
      UPDATE service_states SET service_state_name=?, service_state_message=?, service_state_type=?, service_state_data_format=?, service_state_data_store=?, service_state_input_options=? WHERE service_state_id = ?
    `;
    await db.query(query, [service_state_name, service_state_message, service_state_type, service_state_data_format, service_state_data_store, service_state_input_options, service_state_id]);
    res.json({ message: "Update Successful!" });
  } catch (err) {
    console.error('Error while updating service state:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/updateresponse', async function(req, res, next) {
  try {
    const { service_response_id = '', service_response_name = '', service_response_condition_id = '', service_response_condition_value = '', service_response_type, service_response_value = '', service_response_state_id = ''} = req.body;
    const query = `
      UPDATE service_responses SET service_response_name=?, service_response_condition_id=?, service_response_condition_value=?, service_response_type=?, service_response_value=?, service_response_state_id=? WHERE service_response_id =?
    `;
    await db.query(query, [service_response_name, service_response_condition_id, service_response_condition_value, service_response_type, service_response_value, service_response_state_id, service_response_id]);
    res.json({ message: "Update Successful!" });
  } catch (err) {
    console.error('Error while updating service response:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/updatecondition', async function(req, res, next) {
  try {
    const { service_condition_id = '', service_condition_name = '', service_condition_type = '', service_condition_value = ''} = req.body;
    const query = `
      UPDATE service_conditions SET service_condition_name=?, service_condition_type=?, service_condition_value=? WHERE service_condition_id =?
    `;
    await db.query(query, [service_condition_name, service_condition_type, service_condition_value, service_condition_id]);
    res.json({ message: "Update Successful!" });
  } catch (err) {
    console.error('Error while updating service condition:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/updateapicall', async function(req, res, next) {
  try {
    const { service_api_call_id = '', api_endpoint = '', http_method = '', payload = ''} = req.body;
    const query = `
      UPDATE service_api_calls SET api_endpoint=?, http_method=?, payload=? WHERE service_api_call_id =?
    `;
    await db.query(query, [api_endpoint, http_method, payload, service_api_call_id]);
    res.json({ message: "Update Successful!" });
  } catch (err) {
    console.error('Error while updating service api call:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/deleteservice', async function(req, res, next) {
  try {
    const { itemId } = req.body;
    const query = `DELETE FROM services WHERE service_id=?`;
    await db.query(query, [itemId]);

    res.json({ message: "Service Deleted Successfully!" });
  } catch (err) {
    console.error('Error while deleting service:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/deletestate', async function(req, res, next) {
  try {
    const { itemId } = req.body;
    const query = `DELETE FROM service_states WHERE service_state_id=?`;
    await db.query(query, [itemId]);
    res.json({ message: "State Deleted Successfully!" });
  } catch (err) {
    console.error('Error while deleting state:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/deleteresponse', async function(req, res, next) {
  try {
    const { itemId } = req.body;
    const query = `DELETE FROM service_responses WHERE service_response_id=?`;
    await db.query(query, [itemId]);
    res.json({ message: "Response Deleted Successfully!" });
  } catch (err) {
    console.error('Error while deleting response:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/deletecondition', async function(req, res, next) {
  try {
    const { itemId } = req.body;
    const query = `DELETE FROM service_conditions WHERE service_condition_id=?`;
    await db.query(query, [itemId]);
    res.json({ message: "Condition Deleted Successfully!" });
  } catch (err) {
    console.error('Error while deleting condition:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/deleteapicall', async function(req, res, next) {
  try {
    const { itemId } = req.body;
    const query = `DELETE FROM service_api_calls WHERE service_api_call_id=?`;
    await db.query(query, [itemId]);
    res.json({ message: "API Call Deleted Successfully!" });
  } catch (err) {
    console.error('Error while deleting API call:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;