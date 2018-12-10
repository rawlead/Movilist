angular.module('movilistApp')
  .factory("UserProfile", ["$firebaseObject",
    function ($firebaseObject) {
      return function (username) {
        const ref = firebase.database().ref("users");
        const profileRef = ref.child(username);
        // return it as a synchronized object
        return $firebaseObject(profileRef);
      }
    }
  ])


  .service('toast', function() {
    this.showSuccess = function(message) {
      bulmaToast.toast({
        message: message,
        type: "is-success",
        position: "top-center",
        duration: 2750,
        dismissible: true,
        pauseOnHover: true,
        animate: { in: "fadeIn", out: "fadeOut" }
      });
    }

    this.showWarning = function(message) {
      bulmaToast.toast({
        message: message,
        type: "is-warning",
        position: "top-center",
        duration: 2750,
        dismissible: true,
        pauseOnHover: true,
        animate: { in: "fadeIn", out: "fadeOut" }
      });
    }

    this.showDanger = function(message) {
      bulmaToast.toast({
        message: message,
        type: "is-danger",
        position: "top-center",
        duration: 3000,
        dismissible: true,
        pauseOnHover: true,
        animate: { in: "fadeIn", out: "fadeOut" }
      });
    }
  })


  .service('httpRequests', ['$http', 'api', function ($http, api) {
    this.getMovieDetail = function (movieId) {
      return $http.get(
        api.apiUrl
        + "/movie/"
        + movieId
        + "?api_key="
        + api.apiKey
        + "&language=en-US"
      );
    };
    this.getGenres = function () {
      return $http.get(
        api.apiUrl
        + "/genre/movie/list?api_key="
        + api.apiKey
        + "&language=en-US"
      );
    };
    this.getLatestMovie = function () {
      return $http.get(
        api.apiUrl
        + "/movie/latest"
        + "?api_key="
        + api.apiKey
        + "&language=en-US"
      );
    };
    this.discoverMovies = function () {
      const today = new Date();
      const month = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
      return $http.get(
        api.apiUrl
        + "/discover/movie?first_air_date.gte="
        + month + "&sort_by=popularity.desc&api_key="
        + api.apiKey
      );
    };
    this.searchForMovie = function (query) {
      return $http.get(
        api.apiUrl
        + "/search/movie?api_key="
        + api.apiKey
        + "&language=en-US&query=" + query + "&include_adult=false"
      );
    };
  }])


  .service('movieService', ['api', 'utils', function (api, utils) {
    // firebase rule: ".write": "$uid === auth.uid"
    this.addMovieToList = function (movieList, newMovie) {
      const movieObject = this.mapMovieToObject(newMovie);
      // If user profile doesnt contain array of movies - create one. Otherwise add movie to array of movies.
      if (!movieList) {
        movieList = [movieObject];
      } else {
        movieList.unshift(movieObject);
      }
      return movieList;
    };
    this.removeMovieFromList = function (movieList, movie) {
      return utils.removeFromArray(movieList, movie);
    }
    this.isMovieInList = function (movieList, movie) {
      return movieList && movieList.some(userMovie => userMovie.id === movie.id);
    }
    this.mapMovieToObject = function (movie) {
      let movieObjectGenres = [];
      if (movie.genres) {
        movieObjectGenres = movie.genres
      } else {
        movie.genre_ids.forEach(function (movieGenre) {
          api.genres.forEach(function (genre) {
            if (genre.id === movieGenre) {
              movieObjectGenres.push(genre);
            };
          });
        });
      };
      return {
        id: movie.id,
        poster_path: movie.poster_path,
        title: movie.title,
        vote_count: movie.vote_count,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        genres: movieObjectGenres
      };
    };
  }])


  .service('utils', function () {
    this.removeFromArray = function (arr, value) {
      return arr.filter(function (ele) {
        return ele.id != value.id;
      });
    }
    this.validateEmail = function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  })


  .factory('Page', function() {
    var title = 'Movilist';
    return {
      title: function() { return title; },
      setTitle: function(newTitle) { title = newTitle }
    };
 });