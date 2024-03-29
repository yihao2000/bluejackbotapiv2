var express = require('express');
const soapRequest = require('../soap.js');
var router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const constants = require('../constants.js')
const fetch = require('node-fetch')

const db = require('../services/db.js')


router.post('/getassistantclasses', async (req, res, next) => {
    const parser = new XMLParser();
  
    const { username, semesterID } = req.body;

      try {
          const { response } = await soapRequest(constants.SOAPSERVICEURL, constants.soapHeader('Messier/IGeneralApplicationService/GetClassTransactionByAssistantUsername'), constants.getAssistantClassTransactionByUsernameXMLBody(username, semesterID)); 
          const { body, statusCode } = response;
  
          if (statusCode !== 200) {
              console.error('SOAP request failed with status code:', statusCode);
              res.status(statusCode).json({ success: false, error: 'SOAP request failed' });
              return;
          }
  
  
          const parsedResponse = parser.parse(body, {
              ignoreAttributes: false, 
              attributeNamePrefix: "", 
          });
  
          
          const responseBody = parsedResponse['s:Envelope']['s:Body']['GetClassTransactionByAssistantUsernameResponse']['GetClassTransactionByAssistantUsernameResult']
     
  
          res.json({ success: true, response: responseBody });
      } catch (err) {
          console.error('Error occurred:', err.message);
          res.status(500).json({ success: false, error: err.message });
      }
  });


  router.post('/getlinkedclasses', async function(req, res, next) {
    
    try {
      const { classIDs } = req.body;

      // Create an array of placeholders (?)
      const placeholders = classIDs.map(() => '?').join(', ');
  
      // Use a parameterized query to retrieve rows with matching class IDs
      const query = `
        SELECT * FROM class_line_groups clg WHERE clg.class_id IN (${placeholders})
      `;
  
      const rows = await db.query(query, classIDs);
  
      res.json(rows);
       
    } catch (err) {
      console.log(err)
      console.error('Error while getting linked classes:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  router.post('/getclassbot', async function(req, res, next) {
    
    try {
      const { classID } = req.body;
      // Define the POST request options
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: "CLASS-RETRIEVEBOT",
          params:{
            classId: classID
          }
        }),
      };
      
      // Send the POST request
      fetch(constants.BOTBACKENDURL, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
          }
          return response.json();
        })
        .then((data) => {
          res.json(data)
        })
        .catch((error) => {
          console.log(error)
          res.status(500).json({ error: error.message });
        });
    } catch (err) {
      console.log(err);
      console.error('Error while getting class bot:', err.message);
      res.status(500).json({ error: 'Error while getting class bot' });
     
    }
  });


  router.post('/linkclass', async function(req, res, next) {
    try {
      const { classID, linkCode } = req.body;

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: "LINKGROUP",
          params:{
            classId: classID,
            linkCode: linkCode
          }
        }),
      };
      
      // Send the POST request
      fetch(constants.BOTBACKENDURL, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
          }
          return response.json();
        })
        .then((data) => {
          res.json(data)
        })
        .catch((error) => {
          console.log(error)
          res.status(500).json({ error: error.message });
        });
    } catch (err) {
      console.log(err)
      console.error('Error while trying to link class', err.message);
      res.status(500).json({ error: 'Error while trying to link class' });
    }
  });

 
  router.post('/checkclasslinked', async function(req, res, next) {
    try {
      const { classID } = req.body;

      const query = `
        SELECT * FROM class_line_groups clg WHERE clg.class_id = '${classID}'
      `;
  
      const rows = await db.query(query);
      
  
      res.json(rows);
       
    } catch (err) {
      console.log(err)
      console.error('Error while getting class link status:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/announceclassesmessage', async function(req, res, next) {
    try {
      const { classes, message } = req.body;
   
  
      // Convert the array of classes to a comma-separated string
      const recipientsString = classes.join(',');

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: "ANNOUNCE-ONE-TIME",
          params: {
            recipients: recipientsString,
            msg: message
          }
        }),
      };
      
      // Send the POST request
      fetch(constants.BOTBACKENDURL, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
          }
          return response.json();
        })
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error: error.message });
        });
    } catch (err) {
      console.log(err);
      console.error('Error while trying to link class', err.message);
      res.status(500).json({ error: 'Error while trying to link class' });
    }
  });


  router.post('/getstudentclass', async (req, res, next) => {
    const parser = new XMLParser();
    const { transactionID } = req.body;
      try {
          
          const { response } = await soapRequest(constants.SOAPSERVICEURL, constants.soapHeader('Messier/IGeneralApplicationService/GetStudentClassGroupByClassTransactionId'), constants.getStudentClassGroupByClassTransactionIdXMLBody(transactionID)); 
          const { body, statusCode } = response;
  
          if (statusCode !== 200) {
              console.error('SOAP request failed with status code:', statusCode);
              res.status(statusCode).json({ success: false, error: 'SOAP request failed' });
              return;
          }
  
       
  
          const parsedResponse = parser.parse(body, {
              ignoreAttributes: false, 
              attributeNamePrefix: "", 
          });
   
          const responseBody = parsedResponse['s:Envelope']['s:Body']['GetStudentClassGroupByClassTransactionIdResponse']['GetStudentClassGroupByClassTransactionIdResult']
  
          res.json({ success: true, response: responseBody });
      } catch (err) {
          console.error('Error occurred:', err.message);
          res.status(500).json({ success: false, error: err.message });
      }
  });
  

  router.post('/scheduleclassesmessage', async function(req, res, next) {
    try {
        const { classes, message, scheduleDate, schedulerUserId, repeatOption } = req.body;

        const recipientsString = classes.join(',');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                command: "SCHEDULE-ANNOUNCEMENT",
                params: {
                    recipients: recipientsString,
                    msg: message,
                    timestamp: scheduleDate,
                    schedulerUserId: schedulerUserId,
                    repeatOption: repeatOption,
                }
            }),
        };

        fetch(constants.BOTBACKENDURL, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('HTTP error! Status: ' + response.status);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                res.json(data);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: error.message });
            });
    } catch (err) {
        console.log(err);
        console.error('Error while trying to link class', err.message);
        res.status(500).json({ error: 'Error while trying to link class' });
    }
});

router.post('/getclasstransactionbycourseoutlineandsemester', async (req, res, next) => {
  const parser = new XMLParser();
  const { semesterID, courseOutlineID } = req.body;
    try {
        
        const { response } = await soapRequest(constants.SOAPSERVICEURL, constants.soapHeader('Messier/IGeneralApplicationService/GetClassTransactionByCourseOutlineAndSemester'), constants.getClassTransactionByCourseOutlineAndSemesterXMLBody(semesterID, courseOutlineID)); 
        const { body, statusCode } = response;

        if (statusCode !== 200) {
            console.error('SOAP request failed with status code:', statusCode);
            res.status(statusCode).json({ success: false, error: 'SOAP request failed' });
            return;
        }

     

        const parsedResponse = parser.parse(body, {
            ignoreAttributes: false, 
            attributeNamePrefix: "", 
        });

  
    
        const responseBody = parsedResponse['s:Envelope']['s:Body']['GetClassTransactionByCourseOutlineAndSemesterResponse']['GetClassTransactionByCourseOutlineAndSemesterResult']['a:ClientClassTransction']
      
   
        

        res.json({ success: true, response: responseBody });
    } catch (err) {
        console.error('Error occurred:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});



module.exports = router;
