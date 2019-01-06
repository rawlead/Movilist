'use strict';

angular.module('movilistApp').component('navbar', {
  templateUrl: 'app/common/navbar.html',
  controller: 'NavbarCtrl'
})


.controller('NavbarCtrl', ['$scope', '$firebaseAuth', 'toast', '$location',
  function ($scope, $firebaseAuth, toast, $location) {
    $scope.openAuthForm = $scope.$parent.$parent.openAuthForm;
    const auth = $firebaseAuth();

    $scope.isMobile = false;

    $scope.$parent.$parent.$watch('loggedInUser', function (loggedInUser) {
      $scope.loggedInUser = loggedInUser;
    });

    $scope.handleSignOut = function () {
      auth.$signOut();
      toast.showSuccess('Successfully signed out');
    };

    $scope.toggleMobile = function () {
      $scope.isMobile = !$scope.isMobile;
    }

    $scope.getClass = function (path) {
      return ($location.path().substr(0, path.length) === path) ? 'active' : '';
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
