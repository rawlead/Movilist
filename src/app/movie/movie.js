'use strict';

angular.module('movilistApp.movie', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/movie/:id', {
      templateUrl: 'app/movie/movie.html',
      controller: 'MovieCtrl'
    });
  }])
  .controller('MovieCtrl',
    ['$scope', '$routeParams', '$location', 'httpRequests', 'api', 'movieService', 'toast', 'Page',
      function ($scope, $routeParams, $location, httpRequests, api, movieService, toast, Page) {
        $scope.posterUrlOriginal = api.posterUrlOriginal;
        $scope.isMovieLoading = true;
        $scope.movie = null;
        $scope.loggedInUserProfile = null;
        $scope.isUserProfileLoading = true;
        $scope.isMovieInList = false;


        httpRequests
          .getMovieDetail($routeParams.id)
          .then(function (response) {
            // redirect to a random movie if current movie is adult
            if (response.data.adult) {
              $location.path("/random");
              return;
            }
            Page.setTitle("Movilist - " + response.data.title);
            $scope.movie = response.data;
            $scope.isMovieLoading = false;
          }).catch(function (error) {
            // redirect to a random movie if current movie id doesn't exist
            if (error.status === 404) {
              $location.path("/random");
              return;
            }
            $scope.isMovieLoading = false;
            toast.showDanger(error.message);
          });


        $scope.$parent.$watch('loggedInUserProfile', function (loggedInUserProfile) {
          $scope.loggedInUserProfile = loggedInUserProfile;
          $scope.isMovieInList = false;
          if ($scope.movie && loggedInUserProfile && loggedInUserProfile.movies) {
            $scope.isMovieInList = movieService.isMovieInList(loggedInUserProfile.movies, $scope.movie);
          }
        });

        $scope.$parent.$watch('isUserProfileLoading', function (isUserProfileLoading) {
          $scope.isUserProfileLoading = isUserProfileLoading;
        });

        $scope.$watchGroup(['movie', 'loggedInUserProfile'], function () {
          if ($scope.movie && $scope.loggedInUserProfile && $scope.loggedInUserProfile.movies) {
            $scope.isMovieInList = movieService.isMovieInList($scope.loggedInUserProfile.movies, $scope.movie);
          }
        });


        $scope.removeMovie = function () {
          $scope.loggedInUserProfile.movies = movieService.removeMovieFromList($scope.loggedInUserProfile.movies, $scope.movie);

          $scope.isUserProfileLoading = true;

          $scope.loggedInUserProfile
            .$save()
            .then(function () {
              $scope.isUserProfileLoading = false;
              $scope.isMovieInList = false;
              toast.showSuccess($scope.movie.title + ' has been removed from your list.');
            }).catch(function (error) {
              toast.showDanger(error.message);
            });
        }



        $scope.addMovie = function () {
          // Ask to login in order to add a movie to the list
          if (!$scope.loggedInUserProfile) {
            toast.showWarning('Please log in.');
            $scope.$parent.$parent.openAuthForm();
            return;
          }

          // Check if movie already in the list
          if (movieService.isMovieInList($scope.loggedInUserProfile.movies, $scope.movie)) {
            toast.showWarning($scope.movie.title + ' is already in your list!');
            return;
          }

          // add movie to list and return updated list
          $scope.loggedInUserProfile.movies = movieService.addMovieToList($scope.loggedInUserProfile.movies, $scope.movie);

          $scope.isUserProfileLoading = true;

          // Save updated profile into database
          $scope.loggedInUserProfile
            .$save()
            .then(function () {
              $scope.isUserProfileLoading = false;
              $scope.isMovieInList = true;


              toast.showSuccess($scope.movie.title + ' has been added to your list.');
            }).catch(function (error) {
              toast.showDanger(error.message);
            });
        }
      }]);
