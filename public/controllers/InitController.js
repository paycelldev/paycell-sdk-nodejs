var app = angular.module('paycell', []);

/*
  Controller for the init payment page
*/
app.controller('initController', function ($scope, $http) {

  //set example request
  $scope.hostAccount = "xxxxxx@xxxx.com";
  $scope.language = "tr";
  $scope.amount = "100";
  $scope.currency = "99";
  $scope.paymentSecurity = "NON_THREED_SECURE";
  $scope.instalmentPlan = [{
    lineId: 1,
    paymentMethodType: "CREDIT_CARD",
    cardBrand: "BONUS",
    count: 1,
    amount: 100
  }];

  /*
    deletes instalment plan wiht given lineId
  */
  $scope.deleteInstalmentPlan = function (lineId) {
    for (var i = 0; i < $scope.instalmentPlan.length; i++) {
      if ($scope.instalmentPlan[i].lineId == lineId) {
        $scope.instalmentPlan.splice(i, 1);
        break;
      }
    }
    for (var i = 0; i < $scope.instalmentPlan.length; i++) {
      $scope.instalmentPlan[i].lineId = i + 1;
    }
  };

  /*
    adds an empty instalment plan
  */
  $scope.addInstalmentPlan = function () {
    $scope.instalmentPlan.push({ lineId: $scope.instalmentPlan.length + 1 });
  };

  /*
    calls init method from backend
  */
  $scope.init = function () {
    $scope.trackingId = "";
    $scope.paymentReferenceNumber = "";
    $http({
      url: "/api/init",
      method: "POST",
      data: {
        hostAccount: $scope.hostAccount,
        language: $scope.language,
        amount: $scope.amount,
        currency: $scope.currency,
        paymentSecurity: $scope.paymentSecurity,
        instalmentPlan: $scope.instalmentPlan,
        returnUrl: window.location.host + "/check.html"
      }
    })
      .then(function (response) {
        //response is successfull update variables
        $scope.trackingId = response.data.trackingId;
        $scope.paymentReferenceNumber = response.data.paymentReferenceNumber;
        $scope.updateTrackingUrl();
      },
        function (response) {
          //got error should handle it
          console.log("status: " + response.status + ": " + response.statusText);
        });
  };
  $scope.updateTrackingUrl = function () {
    //tracking url should be changed for prod
    $scope.trackingUrl = $scope.trackingId != null ? "https://sdk-services-test.turkcell.com.tr/Validation/Tracking/" + $scope.trackingId : "";
    console.log($scope.trackingUrl)
  }
});
