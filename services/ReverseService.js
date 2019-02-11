const { reverseMethodUrl, merchantCode, applicationName, applicationPassword, referenceNumberPrefix } = require('../Consts');
var request = require('request');
var uuid = require('node-uuid');
var moment = require('moment');
var devLogger = require('debug')('dev');

/**
 * Calls reverse method from Paycell Web SDK
 * 
 * @param {Object} req rest request for reverse
 * @param {Object} res rest response for reverse
 */
module.exports.reverse = function (req, res) {
  var data = {
    merchantCode,
    msisdn: req.body.msisdn,
    originalReferenceNumber: req.body.originalPaymentReferenceNumber,
    referenceNumber: uuid.v1(),
    requestHeader: {
      transactionDateTime: moment().format('YYYYMMDDHHmmssSSS'),
      transactionId: referenceNumberPrefix + moment().format('YYYYMMDDHHmmssSSS'),
      clientIPAddress: req.connection.remoteAddress,
      applicationName,
      applicationPwd: applicationPassword,
    }
  };
  devLogger("ReverseRequest: " + JSON.stringify(data, null, 2))
  var response = request.post(reverseMethodUrl, { json: data },
    function (error, response, body) {
      if (error) {
        //error exists
        devLogger("Error: " + error);
        res.end(JSON.stringify(error));
      } else {
        //response is successful
        devLogger("ReverseResponse: " + JSON.stringify(body, null, 2));
        var responseText = JSON.stringify({
          responseCode: body.responseHeader.responseCode,
          responseDescription: body.responseHeader.responseDescription
        }, null, 2);
        res.end(responseText);
      }
    });

}