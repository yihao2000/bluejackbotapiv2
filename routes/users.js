var express = require('express');
const soapRequest = require('../soap.js');
var router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const { SOAPSERVICEURL } = require('../constants.js');
const constants = require('../constants.js')
const createMessierPassword = require('../utils/generator.js')


// Route to fetch all users
router.post('/login', async (req, res, next) => {
  // const soapRequestHeaders = {
  //     'Content-Type': 'text/xml;charset=UTF-8',
  //     'soapAction': 'Messier/IGeneralApplicationService/LogOnMobile', 
  // };
  const { username, password } = req.body;
  const parser = new XMLParser();
  createMessierPassword(username, password).then(async modifiedPassword => {
    try {
      
        const { response } = await soapRequest(constants.SOAPSERVICEURL, constants.soapHeader('Messier/IGeneralApplicationService/LogOnQualification'), constants.loginXMLBody(username, modifiedPassword)); // Optional timeout parameter (milliseconds)
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
        const responseBody = parsedResponse['s:Envelope']['s:Body']['LogOnQualificationResponse']['LogOnQualificationResult'];
        res.json({ success: true, response: responseBody });
    } catch (err) {
        console.error('Error occurred:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
  }).catch(err => {
    console.error('Error occurred:', err.message);
    res.status(500).json({ success: false, error: err.message });
  })

  



});


module.exports = router;
