"use strict";

angular.module('movilistApp').component('searchBar', {
  templateUrl: 'app/common/searchBar.html',
  controller: 'SearchBarCtrl'
}).controller('SearchBarCtrl',
  ['$scope', 'httpRequests', 'api', 'movieService', 'config', 'toast',
    function ($scope, httpRequests, api, movieService, config, toast) {

      $scope.posterUrlSmall = api.posterUrlSmall;
      $scope.isVisible = false;
      $scope.isLoading = false;
      $scope.query = "";

      // Setting the visibility of dropdown panel with results
      $scope.setVisibility = function (isVisible) {
        $scope.isVisible = isVisible;
      }

      $scope.onQueryChange = function () {
        // Doesnt perform any actions if query is empty
        if ($scope.query === '') {
          $scope.isVisible = false;
          $scope.searchResults = [];
          return;
        }

        // for converting genres ids into readable genre names
        $scope.genres = api.genres;

        // Dropdown panel with results
        $scope.isVisible = true;
        $scope.isLoading = true;

        // Perform search get request
        httpRequests
          .searchForMovie($scope.query)
          .then(function (response) {
            $scope.searchResults = response.data.results.slice(0, config.numberOfSearchResults);
            $scope.isLoading = false;
          }).catch(function (error) {
            toast.showDanger(error.message);
            $scope.isLoading = false;
          })
      }

      // put profile in the scope for use in DOM
      $scope.$parent.$watch('loggedInUserProfile', function (loggedInUserProfile) {
        // get profile from url
        $scope.loggedInUserProfile = loggedInUserProfile;
      });

      $scope.addMovie = function (newMovie) {
        // Ask to login in order to add a movie to the list
        if (!$scope.loggedInUserProfile) {
          toast.showWarning('Please log in.');
          $scope.$parent.$parent.openAuthForm();
          return;
        }

        // Check if movie already in the list
        if (movieService.isMovieInList($scope.loggedInUserProfile.movies, newMovie)) {
          toast.showWarning(newMovie.title + ' is already in your list!');
          return;
        }

        // add movie to list and return updated list
        $scope.loggedInUserProfile.movies = movieService.addMovieToList($scope.loggedInUserProfile.movies, newMovie);

        // Save updated profile into database
        $scope.loggedInUserProfile.$save().then(function () {
          toast.showSuccess(newMovie.title + ' has been added to your list.');
        }).catch(function (error) {
          toast.showDanger(error.message);
        });
      }
    }])
