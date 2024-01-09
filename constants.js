const SOAPSERVICEURL =
  "https://socs1.binus.ac.id/messier/GeneralApplication.svc?wsdl";
const BOTBACKENDURL = "https://bluejackbot.jex.ink/server/manualrequest";

function soapHeader(action) {
  return {
    "Content-Type": "text/xml;charset=UTF-8",
    soapAction: action,
  };
}

function saltXMLBody(username) {
  return `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="Messier">
      <soapenv:Header/>
      <soapenv:Body>
         <mes:GetSalt>
            <!--Optional:-->
            <mes:userName>${username}</mes:userName>
         </mes:GetSalt>
      </soapenv:Body>
   </soapenv:Envelope>
   `;
}

function logonBPlusTraining(username, password) {
   return `
   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="Messier">
      <soapenv:Header/>
      <soapenv:Body>
         <mes:LogOnBPlusTraining>
            <!--Optional:-->
            <mes:userName>${username}</mes:userName>
            <!--Optional:-->
            <mes:password>${password}</mes:password>
            <!--Optional:-->
            <mes:isPersistent>${false}</mes:isPersistent>
         </mes:LogOnBPlusTraining>
      </soapenv:Body>
   </soapenv:Envelope>
   `
}

function loginXMLBody(username, password) {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="Messier">
    <soapenv:Header/>
    <soapenv:Body>
       <mes:LogOnQualification>
          <!--Optional:-->
          <mes:userName>${username}</mes:userName>
          <!--Optional:-->
          <mes:password>${password}</mes:password>
       </mes:LogOnQualification>
    </soapenv:Body>
 </soapenv:Envelope>
    `;
}

function getActiveSemesterXMLBody() {
  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="Messier">
   <soapenv:Header/>
   <soapenv:Body>
      <mes:GetActiveSemester/>
   </soapenv:Body>
</soapenv:Envelope>`;
}

function getSemestersXMLBody() {
  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="Messier">
    <soapenv:Header/>
    <soapenv:Body>
       <mes:GetSemesters/>
    </soapenv:Body>
 </soapenv:Envelope>`;
}

function getActiveCourseOutlinesInSemester(messierID, semesterID) {
  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="Messier">
   <soapenv:Header/>
   <soapenv:Body>
      <mes:GetActiveCourseOutlinesInSemester>
         <!--Optional:-->
         <mes:userId>${messierID}</mes:userId>
         <!--Optional:-->
         <mes:semesterId>${semesterID}</mes:semesterId>
      </mes:GetActiveCourseOutlinesInSemester>
   </soapenv:Body>
</soapenv:Envelope>`;
}

function getAssistantClassTransactionByUsernameXMLBody(username, semesterID) {
  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="Messier">
   <soapenv:Header/>
   <soapenv:Body>
      <mes:GetClassTransactionByAssistantUsername>

         <mes:username>${username}</mes:username>
 
         <mes:semesterId>${semesterID}</mes:semesterId>
      </mes:GetClassTransactionByAssistantUsername>
   </soapenv:Body>
</soapenv:Envelope>`;
}

function getStudentClassGroupByClassTransactionIdXMLBody(transactionID) {
  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="Messier">
   <soapenv:Header/>
   <soapenv:Body>
      <mes:GetStudentClassGroupByClassTransactionId>
         <!--Optional:-->
         <mes:classTransactionId>${transactionID}</mes:classTransactionId>
      </mes:GetStudentClassGroupByClassTransactionId>
   </soapenv:Body>
</soapenv:Envelope>`;
}

function getClassTransactionByCourseOutlineAndSemesterXMLBody(
  semesterID,
  courseOutlineID
) {
  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="Messier">
   <soapenv:Header/>
   <soapenv:Body>
      <mes:GetClassTransactionByCourseOutlineAndSemester>
         <mes:semesterId>${semesterID}</mes:semesterId>
         <mes:coid>${courseOutlineID}</mes:coid>
      </mes:GetClassTransactionByCourseOutlineAndSemester>
   </soapenv:Body>
</soapenv:Envelope>`;
}

function getChannels() {
  return `SELECT c.channel_id, c.channel_name, c.channel_description, cs.class_id FROM channels c LEFT JOIN channel_subscriptions cs ON c.channel_id = cs.channel_id`;
}

function getScheduledMessages() {
  return `SELECT * FROM scheduled_messages`;
}

function getTemplateMessages() {
  return `SELECT 
   template_id as "id",
   template_name as "name",   
   template_owner_id as "owner_id",
   template_raw_content as "raw_content",
   template_is_shared as "is_shared"
  FROM message_templates
  `;
}

function getTemplateMessageData(template_id) {
   return `
      SELECT * FROM message_template_data WHERE id = '${template_id}'
   `
}

module.exports = {
  SOAPSERVICEURL,
  BOTBACKENDURL,
  soapHeader,
  saltXMLBody,
  logonBPlusTraining,
  loginXMLBody,
  getSemestersXMLBody,
  getActiveSemesterXMLBody,
  getAssistantClassTransactionByUsernameXMLBody,
  getChannels,
  getStudentClassGroupByClassTransactionIdXMLBody,
  getScheduledMessages,
  getTemplateMessages,
  getTemplateMessageData,
  getActiveCourseOutlinesInSemester,
  getClassTransactionByCourseOutlineAndSemesterXMLBody,
};
