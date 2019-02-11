var app = angular.module('paycell', []);

app.config(function ($locationProvider) {
  //html5 is required for reading url parameters
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  })
});

/**
*  Controller for check page
*/
app.controller('checkController', function ($scope, $location, $http) {
  $scope.originalPaymentReferenceNumber = $location.search().paymentReferenceNumber;

  /**
  *  Calls query statu from backend
  */
  $scope.check = function () {
    $http({
      url: "/api/queryStatu",
      method: "POST",
      data: {
        originalPaymentReferenceNumber: $scope.originalPaymentReferenceNumber
      }
    })
      .then(function (response) {
        $scope.responseCode = response.data.responseCode;
        $scope.responseDescription = response.data.responseDescription;
        if (response.data.responseCode == 0) {
          //response is successfull should update variables
          $scope.acquirerbankCode = response.data.acquirerbankCode;
          $scope.msisdn = response.data.msisdn;
          $scope.amount = response.data.amount;
          $scope.approvalCode = response.data.approvalCode;
          $scope.currency = response.data.currency;
          $scope.installmentCount = response.data.installmentCount;
          $scope.orderId = response.data.orderId;
          $scope.paymentSecurity = response.data.paymentSecurity;
          $scope.paymentDate = response.data.paymentDate;
          $scope.reconcilationDate = response.data.reconcilationDate;
          $scope.issuerBankCode = response.data.issuerBankCode;
          $scope.status = response.data.status;
          $scope.statusExplanation = response.data.statusExplanation;
          $scope.paymentMethodId = response.data.paymentMethodId;
          $scope.paymentMethodNumber = response.data.paymentMethodNumber;
          $scope.paymentMethodType = response.data.paymentMethodType;
        } else {
          alert($scope.responseDescription);
        }
      },
        function (response) {
          //got error should handle it
          console.log("status: " + response.status + ": " + response.statusText);
        });
  };

  /**
   * Calls reverse from backend
   */
  $scope.reverse = function () {
    $http({
      url: "/api/reverse",
      method: "POST",
      data: {
        originalPaymentReferenceNumber: $scope.originalPaymentReferenceNumber,
        msisdn: $scope.msisdn
      }
    })
      .then(function (response) {
        //response is successfull should update variables
        $scope.responseDescription = response.data.responseDescription;
        alert($scope.responseDescription);
        $scope.check();
      },
        function (response) {
          //got error should handle it
          console.log("status: " + response.status + ": " + response.statusText);
        });
  }

  /**
   * Calls refund from backend
   */
  $scope.refund = function () {
    $http({
      url: "/api/refund",
      method: "POST",
      data: {
        originalPaymentReferenceNumber: $scope.originalPaymentReferenceNumber,
        amount: $scope.refundAmount,
        msisdn: $scope.msisdn
      }
    })
      .then(function (response) {
        //response is successful should update variables
        $scope.responseDescription = response.data.responseDescription;
        alert($scope.responseDescription);
        $scope.check();
      },
        function (response) {
          //got error should handle it
          console.log("status: " + response.status + ": " + response.statusText);
        });
  }
  $scope.check();
});