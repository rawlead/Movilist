'use strict';

// Declare app level module which depends on views, and core components
angular.module('movilistApp',
  [
    'ngRoute',
    'firebase',
    'movilistApp.home',
    'movilistApp.discover',
    'movilistApp.movie',
    'movilistApp.randomMovie',
    'movilistApp.version',
  ]
)

  .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({ redirectTo: '/discover' });
  }])


  // .run(['$rootScope', function ($rootScope) {
  //   $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
  //     $rootScope.title = current.$$route.title;
  //   });
  // }])


  .controller('MainCtrl', ['$scope', '$firebaseAuth', 'api', 'httpRequests', 'UserProfile', 'toast', 'Page',
    function ($scope, $firebaseAuth, api, httpRequests, UserProfile, toast, Page) {
      const auth = $firebaseAuth();

      $scope.Page = Page;

      $scope.isUserProfileLoading = true;
      $scope.loggedInUserProfile = null;
      $scope.loggedInUser = null;

      // any time auth state changes, add the user data to scope
      auth.$onAuthStateChanged(function (firebaseUser) {
        if (!firebaseUser) {
          $scope.loggedInUser = null;
          $scope.loggedInUserProfile = null;
          $scope.isUserProfileLoading = false;
          return;
        }

        $scope.loggedInUser = firebaseUser;
        $scope.isUserProfileLoading = true;

        // put profile in the scope for use in DOM
        UserProfile(firebaseUser.uid).$loaded()
          .then(function (data) {
            // set email to profile for new users
            if (!data.email) {
              data.email = firebaseUser.email;
            }
            $scope.loggedInUserProfile = data;
            $scope.isUserProfileLoading = false;
          })
      })

      // VISIBILITY OF MODAL AUTHENTICATION FORM
      $scope.isAuthFormVisible = false;

      httpRequests
        .getGenres()
        .then(function (response) {
          api.genres = response.data.genres;
        }).catch(function (error) {
          toast.showDanger(error.message);
        })

      // AUTHENTICATION MODAL FORM VISIBILITY 
      $scope.openAuthForm = function () {
        $scope.isAuthFormVisible = true;
      }
      $scope.closeAuthForm = function () {
        $scope.isAuthFormVisible = false;
      }
    }])


