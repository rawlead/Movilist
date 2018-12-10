angular.module('movilistApp')

.constant('config', {
  numberOfSearchResults: 6
})

.constant('api', {
  apiUrl: 'https://api.themoviedb.org/3',
  apiKey: 'fc03865af07903e7497fb004cdade7e4',
  posterUrlSmall: 'https://image.tmdb.org/t/p/w500',
  posterUrlOriginal: 'https://image.tmdb.org/t/p/original',
  genres: []
});
