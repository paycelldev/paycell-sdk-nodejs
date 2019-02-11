const { queryStatuMethodUrl, merchantCode, applicationName, applicationPassword, referenceNumberPrefix } = require('../Consts');
var request = require('request');
var moment = require('moment');
var devLogger = require('debug')('dev');
7/**
 * Calls queryStatu method from Paycell Web SDK
 *
 * @param {Object} req rest request for queryStatu
 * @param {Object} res rest response for queryStatu
 */
module.exports.queryStatu = function (req, res) {
  var data = {
    originalPaymentReferenceNumber: req.body.originalPaymentReferenceNumber,
    merchantCode,
    requestHeader: {
      transactionDateTime: moment().format('YYYYMMDDHHmmssSSS'),
      transactionId: referenceNumberPrefix + moment().format('YYYYMMDDHHmmssSSS'),
      clientIPAddress: req.connection.remoteAddress,
      applicationName,
      applicationPwd: applicationPassword,
    }
  };
  devLogger("QueryStatuRequest: " + JSON.stringify(data, null, 2))
  request.post(queryStatuMethodUrl, { json: data },
    function (error, response, body) {
      if (error) {
        devLogger("Error: " + error);
        res.end(JSON.stringify(error));
      }
      else {
        devLogger("QueryStatuResponse: " + JSON.stringify(body, null, 2));
        var responseText;
        if (body.responseHeader && body.responseHeader.responseCode == 0) {
          //response is successfull
          responseText = JSON.stringify({
            responseCode: body.responseHeader.responseCode,
            responseDescription: body.responseHeader.responseDescription,
            acquirerbankCode: body.acquirerbankCode,
            msisdn: body.msisdn,
            amount: body.amount,
            approvalCode: body.approvalCode,
            currency: body.currency,
            installmentCount: body.installmentCount,
            orderId: body.orderId,
            paymentSecurity: body.paymentSecurity,
            paymentDate: body.paymentDate,
            reconcilationDate: body.reconcilationDate,
            paymentReferenceNumber: body.paymentReferenceNumber,
            issuerBankCode: body.issuerBankCode,
            status: body.status,
            statusExplanation: body.statusExplanation,
            paymentMethodId: body.paymentMethod.paymentMethodId,
            paymentMethodNumber: body.paymentMethod.paymentMethodNumber,
            paymentMethodType: body.paymentMethod.paymentMethodType
          }, null, 2);
        } else if (response.responseHeader) {
          //errors exit
          responseText = JSON.stringify({
            responseCode: body.responseHeader.responseCode,
            responseDescription: body.responseHeader.responseDescription,
          });
        } else {
          responseText = JSON.stringify({
            responseCode: 502,
            responseDescription: "Service is not responding",
          });
        }
        res.end(responseText);
      }
    });

}

