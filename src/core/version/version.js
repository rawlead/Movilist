'use strict';

angular.module('movilistApp.version', [
  'movilistApp.version.interpolate-filter',
  'movilistApp.version.version-directive'
])

.value('version', '0.1');
