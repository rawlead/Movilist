'use strict';

angular.module('movilistApp').component('footerBottom', {
  templateUrl: 'app/common/footer.html',
  controller: 'FooterCtrl'
})


  .controller('FooterCtrl', ['$scope',
    function ($scope) {
      $scope.test = "test"
    }])


