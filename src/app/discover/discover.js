'use strict';

angular.module('movilistApp.discover', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/discover', {
      // title: 'Discover',
      templateUrl: 'app/discover/discover.html',
      controller: 'DiscoverCtrl'
    });
  }])

  .controller("DiscoverCtrl", ["$scope", "httpRequests", "api", 'movieService', 'toast', 'Page',
    function ($scope, httpRequests, api, movieService, toast, Page) {
      $scope.posterUrlSmall = api.posterUrlSmall;
      Page.setTitle("Movilist - Discover");

      httpRequests
        .discoverMovies()
        .then(function (response) {
          $scope.genres = api.genres;
          $scope.results = response.data.results;
        }).catch(function (error) {
          toast.showDanger(error.message);
        });


      // put profile in the scope for use in DOM
      $scope.$parent.$watch('loggedInUserProfile', function (loggedInUserProfile) {
        // get profile from url
        $scope.loggedInUserProfile = loggedInUserProfile;
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
    }]);
