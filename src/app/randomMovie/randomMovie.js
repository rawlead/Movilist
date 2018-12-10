'use strict';

angular.module('movilistApp.randomMovie', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/random', {
      // empty template to work with controller
      templateUrl: 'app/randomMovie/randomMovie.html',
      controller: 'RandomMovieCtrl'
    });
  }])

  .controller('RandomMovieCtrl', ['$location', 'httpRequests', 'toast',
    function ($location, httpRequests, toast) {
      // Get latest movie from API
      httpRequests
        .getLatestMovie()
        .then(function (response) {
          // Generete random movie id from 1 up to the latest movie id (around 500000) and redirect to the page with that movie
          const randomMovieId = Math.floor(Math.random() * (response.data.id - 1) + 1);
          $location.path("/movie/" + randomMovieId)
        }).catch(function (error) {
            toast.showDanger(error.message);
        })
    }]);
