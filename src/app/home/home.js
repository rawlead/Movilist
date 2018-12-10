'use strict';

angular.module('movilistApp.home', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/list/:id', {
      title: 'List',
      templateUrl: 'app/home/home.html',
      controller: 'HomeCtrl'
    });
  }])

  // This page contains a list of movies
  // Url /list/:id, where id is a list id, and it is equal to user id
  // Main scope (app.js) has two types of user data: loggedInUser (current user) and loggedInUserProfile (list of movies)
  // This page displays passed by URL list (userProfile) and has access to the main $scope (loggedInUserProfile)
  // If loggedInUserProfile id is equals to current userProfile id - user is able to remove from list otherwise add to list ( save movies from shared list )

  .controller("HomeCtrl", ["$scope", "$routeParams", "api", "movieService", 'UserProfile', 'toast', 'Page',
    function ($scope, $routeParams, api, movieService, UserProfile, toast, Page) {

      Page.setTitle("Movilist");

      $scope.currentListId = $routeParams.id;
      $scope.isListBelongsToUser = false;
      $scope.isUserProfileLoading = true;
      $scope.userProfile = null;
      $scope.loggedInUserProfile = null;

      $scope.posterUrlSmall = api.posterUrlSmall;

      // put profile in the scope for use in DOM
      $scope.$parent.$watch('loggedInUserProfile', function (loggedInUserProfile) {
        // get profile from url
        $scope.userProfile = UserProfile($scope.currentListId);
        $scope.loggedInUserProfile = loggedInUserProfile;
        $scope.isListBelongsToUser = false;

        Page.setTitle("Movilist");

        if (loggedInUserProfile && loggedInUserProfile.$id === $scope.currentListId) {
          $scope.isListBelongsToUser = true;
        }
      });

      $scope.$parent.$watch('isUserProfileLoading', function (isUserProfileLoading) {
        $scope.isUserProfileLoading = isUserProfileLoading;
      });

      $scope.isMovieInList = function (movie) {
        return $scope.loggedInUserProfile && movieService.isMovieInList($scope.loggedInUserProfile.movies, movie);
      }

      $scope.addMovie = function (movie) {
        if (!$scope.loggedInUserProfile || $scope.isListBelongsToUser) {
          toast.showWarning('Please log in.');
          return;
        }
        // add movie to list and return updated list
        $scope.loggedInUserProfile.movies = movieService.addMovieToList($scope.loggedInUserProfile.movies, movie);

        // Save updated profile into database
        $scope.loggedInUserProfile
          .$save()
          .then(function () {
            toast.showSuccess(movie.title + ' has been added to your list.');
          }).catch(function (error) {
            toast.showDanger(error.message);
          });
      }

      $scope.removeMovie = function (movie) {
        if (!$scope.isListBelongsToUser) {
          return;
        }
        $scope.userProfile.movies = movieService.removeMovieFromList($scope.userProfile.movies, movie);
        $scope.userProfile.$save().then(function () {
          toast.showSuccess(movie.title + ' hase been removed from your list.');
        }).catch(function (error) {
          toast.showDanger(error.message);
        });
      }
    }
  ]);
