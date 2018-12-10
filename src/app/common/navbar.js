'use strict';

angular.module('movilistApp').component('navbar', {
  templateUrl: 'app/common/navbar.html',
  controller: 'NavbarCtrl'
})


.controller('NavbarCtrl', ['$scope', '$firebaseAuth', 'toast',
  function ($scope, $firebaseAuth, toast) {
    $scope.openAuthForm = $scope.$parent.$parent.openAuthForm;
    const auth = $firebaseAuth();

    $scope.$parent.$parent.$watch('loggedInUser', function (loggedInUser) {
      $scope.loggedInUser = loggedInUser;
    });

    $scope.handleSignOut = function () {
      auth.$signOut();
      toast.showSuccess('Successfully signed out');
    }
  }])

  .directive('changeClassOnScroll', function ($window) {
    return {
      restrict: 'A',
      scope: {
          offset: "@",
          scrollClass: "@"
      },
      link: function(scope, element) {
          angular.element($window).bind("scroll", function() {
              if (this.pageYOffset >= parseInt(scope.offset)) {
                  element.addClass(scope.scrollClass);
              } else {
                  element.removeClass(scope.scrollClass);
              }
          });
      }
    };
  });
