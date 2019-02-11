const { applicationName, applicationPassword, merchantCode, secureCode, terminalCode, referenceNumberPrefix, initMethodUrl } = require('../Consts')

var request = require('request');
var uuid = require('node-uuid');
var moment = require('moment');
var crypto = require('crypto')
var devLogger = require('debug')('dev');

/**
 * Calls init method from Paycell Web SDK
 */
module.exports.init = function (req, res) {
  var data = {
    requestHeader:
    {
      applicationName,
      applicationPassword,
      merchant:
      {
        merchantCode,
        terminalCode
      },
      transactionInfo:
      {
        transactionDateTime: moment().format('YYYYMMDDHHmmssSSS'),
        transactionId: referenceNumberPrefix + moment().format('YYYYMMDDHHmmssSSS')
      }
    },
    hashData: null,
    hostAccount: req.body.hostAccount,
    language: req.body.language,
    payment:
    {
      amount: req.body.amount,
      currency: req.body.currency,
      paymentReferenceNumber: uuid.v1(),
      paymentSecurity: req.body.paymentSecurity,
      instalmentPlan: req.body.instalmentPlan
    },
    returnUrl: null,
    postResultUrl: "",
    timeoutDuration: "300"
  };

  //calculate hashData after request is created
  data.hashData = hashData(data);

  //calculate returnUrl after paymentReferenceNumber is defined
  data.returnUrl = req.body.returnUrl + "?paymentReferenceNumber=" + data.payment.paymentReferenceNumber;

  devLogger("InitRequest: " + JSON.stringify(data, null, 2));
  request.post(initMethodUrl, { json: data },
    function (error, response, body) {
      if (error) {
        //error exits
        devLogger("Error: " + error);
        res.end(JSON.stringify({ error }))
      } else {
        //response is successful
        devLogger("InitResponse: " + JSON.stringify(body, null, 2));

        var responseText = JSON.stringify({
          trackingId: body.trackingId,
          paymentReferenceNumber: data.payment.paymentReferenceNumber
        }, null, 2);
        res.end(responseText);
      }
    });

}

/**
 * Hashes request data
 * sha256 is used for hashing
 */
var hashData = function (data) {
  var securityData = sha256(secureCode + terminalCode);
  var hashData = sha256(data.payment.paymentReferenceNumber + terminalCode + data.payment.amount + data.payment.currency + data.payment.paymentSecurity + data.hostAccount + securityData);
  return hashData;
}

/**
 * 
 * @param {String} text Hashes given text in sha256
 */
var sha256 = function (text) {
  var hash = crypto.createHash('sha256')
    .update(text, 'utf8')
    .digest()
    .toString('base64');
  return hash;
}

