'use strict';

describe('movilistApp.version module', function() {
  beforeEach(module('movilistApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
