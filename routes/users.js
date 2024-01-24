var express = require("express");
const soapRequest = require("../soap.js");
var router = express.Router();
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const { SOAPSERVICEURL } = require("../constants.js");
const constants = require("../constants.js");
const createMessierPassword = require("../utils/generator.js");

const getSalt = async (username) => {
  const parser = new XMLParser();
  console.log(username)
  try {
    const res = await soapRequest(
      constants.SOAPSERVICEURL,
      constants.soapHeader("Messier/IGeneralApplicationService/GetSalt"),
      constants.saltXMLBody(username)
    );
    const { body, statusCode } = res.response;

    if (statusCode !== 200) {
      console.log(body)
      return {
        status: statusCode,
        response: body,
      };
    }
    const parsedResponse = parser.parse(body, {
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });

    const responseBody =
      parsedResponse["s:Envelope"]["s:Body"]["GetSaltResponse"][
        "GetSaltResult"
      ]["a:Salt"];

      console.log(responseBody);
    return responseBody;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const logonBPlusTraining = async (username, password, res) => {
  const parser = new XMLParser();
  try {
    const { response } = await soapRequest(
      constants.SOAPSERVICEURL,
      constants.soapHeader(
        "Messier/IGeneralApplicationService/LogOnBPlusTraining"
      ),
      constants.logonBPlusTraining(username, password)
    ); // Optional timeout parameter (milliseconds)
    const { body, statusCode } = response;
    if (statusCode === 200) {
      const parsedResponse = parser.parse(body, {
        ignoreAttributes: false,
        attributeNamePrefix: "",
      });
      const responseBody =
        parsedResponse["s:Envelope"]["s:Body"]["LogOnBPlusTrainingResponse"][
          "LogOnBPlusTrainingResult"
        ];
      console.log(responseBody)
      return {
        statusCode: statusCode,
        salt: password,
        response: responseBody,
      };
    } else {
      return {
        statusCode: statusCode,
        salt: "error",
        response: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      error: "Fetch failed",
    };
  }
};

router.post("/get-salt", async (req, res, next) => {
  const { username } = req.body;
  try {
    const salt = await getSalt(username);
    console.log(salt)
    return res.json({
      salt: salt,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Fetch failed",
    });
  }
});
// Route to fetch all users
router.post("/login", async (req, res, next) => {
  // const soapRequestHeaders = {
  //     'Content-Type': 'text/xml;charset=UTF-8',
  //     'soapAction': 'Messier/IGeneralApplicationService/LogOnMobile',
  // };
  const { username, password } = req.body;
  return res.json(await logonBPlusTraining(username, password));
  // getSalt(username)
  //   .then(async (salt) => {
  //     const { response } = await soapRequest(
  //       constants.SOAPSERVICEURL,
  //       constants.soapHeader(
  //         "Messier/IGeneralApplicationService/LogOnBPlusTraining"
  //       ),
  //       constants.logonBPlusTraining(username, salt)
  //     ); // Optional timeout parameter (milliseconds)
  //     const { body, statusCode } = response;
  //     console.log(body)
  //     return res.json({
  //       salt: salt,
  //       body: body,
  //     });
  //   })
  //   .catch((error) => {
  //     console.error("ASdasd = " + error)
  //     res.status(400).json({ success: false, error: "SOAP request failed" });
  //     return res;
  //   });

  // createMessierPassword(username, password)
  //   .then(async (modifiedPassword) => {
  //     try {
  //       const { response } = await soapRequest(
  //         constants.SOAPSERVICEURL,
  //         constants.soapHeader(
  //           "Messier/IGeneralApplicationService/LogOnQualification"
  //         ),
  //         constants.loginXMLBody(username, modifiedPassword)
  //       ); // Optional timeout parameter (milliseconds)
  //       const { body, statusCode } = response;
  //       if (statusCode !== 200) {
  //         console.error("SOAP request failed with status code:", statusCode);
  //         res
  //           .status(statusCode)
  //           .json({ success: false, error: "SOAP request failed" });
  //         return;
  //       }
  //       const parsedResponse = parser.parse(body, {
  //         ignoreAttributes: false,
  //         attributeNamePrefix: "",
  //       });
  //       const responseBody =
  //         parsedResponse["s:Envelope"]["s:Body"]["LogOnQualificationResponse"][
  //           "LogOnQualificationResult"
  //         ];
  //       res.json({ success: true, response: responseBody });
  //     } catch (err) {
  //       console.error("Error occurred:", err.message);
  //       res.status(500).json({ success: false, error: err.message });
  //     }
  //   })
  //   .catch((err) => {
  //     console.error("Error occurred:", err.message);
  //     res.status(500).json({ success: false, error: err.message });
  //   });
});

module.exports = router;
