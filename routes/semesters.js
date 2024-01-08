var express = require('express');
const soapRequest = require('../soap.js');
var router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const constants = require('../constants.js')



router.get('/getactivesemester', async (req, res, next) => {
    const parser = new XMLParser();
  
      try {
          const { response } = await soapRequest(constants.SOAPSERVICEURL, constants.soapHeader('Messier/IGeneralApplicationService/GetActiveSemester'), constants.getActiveSemesterXMLBody()); 
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
  
          const responseBody = parsedResponse['s:Envelope']['s:Body']['GetActiveSemesterResponse']['GetActiveSemesterResult']
        //   console.log(responseBody);
  
          res.json({ success: true, response: responseBody });
      } catch (err) {
          console.error('Error occurred:', err.message);
          res.status(500).json({ success: false, error: err.message });
      }
  });


router.get('/getsemesters', async (req, res, next) => {
    const parser = new XMLParser();
  
      try {
          const { response } = await soapRequest(constants.SOAPSERVICEURL, constants.soapHeader('Messier/IGeneralApplicationService/GetSemesters'), constants.getSemestersXMLBody()); 
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
  
          const responseBody = parsedResponse['s:Envelope']['s:Body']['GetSemestersResponse']['GetSemestersResult']['a:ClientSemester'];
        //   console.log(responseBody);
  
          res.json({ success: true, response: responseBody });
      } catch (err) {
          console.error('Error occurred:', err.message);
          res.status(500).json({ success: false, error: err.message });
      }
  });

  router.post('/getactivesemestercourseoutlines', async (req, res, next) => {
    const parser = new XMLParser();
    const {messierID, semesterID} = req.body

      try {
          const { response } = await soapRequest(constants.SOAPSERVICEURL, constants.soapHeader('Messier/IGeneralApplicationService/GetActiveCourseOutlinesInSemester'), constants.getActiveCourseOutlinesInSemester(messierID, semesterID)); 
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
  
          const responseBody = parsedResponse['s:Envelope']['s:Body']['GetActiveCourseOutlinesInSemesterResponse']['GetActiveCourseOutlinesInSemesterResult']['a:ClientCourseOutline']
          console.log(responseBody);
  
          res.json({ success: true, response: responseBody });
      } catch (err) {
          console.error('Error occurred:', err.message);
          res.status(500).json({ success: false, error: err.message });
      }
  });

module.exports = router;
