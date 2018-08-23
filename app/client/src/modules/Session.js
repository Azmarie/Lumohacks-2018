angular.module('reg')
  .service('Session', [
    '$rootScope',
    '$window',
    function($rootScope, $window){
    
    var loggedOut = {}

    this.isLoggedOut = function(user) {
      return !!loggedOut[user];
    }

    this.create = function(token, user){
      $window.localStorage.jwt = token;
      $window.localStorage.userId = user._id;
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;

      loggedOut[user] = false;
    };

    this.destroy = function(onComplete){
      loggedOut[$window.localStorage.currentUser] = true;

      delete $window.localStorage.jwt;
      delete $window.localStorage.userId;
      delete $window.localStorage.currentUser;

      $rootScope.currentUser = null;
      if (onComplete){
        onComplete();
      }
    };

    this.getToken = function(){
      return $window.localStorage.jwt;
    };

    this.getUserId = function(){
      return $window.localStorage.userId;
    };

    this.getUser = function(){
      return JSON.parse($window.localStorage.currentUser);
    };

    this.setUser = function(user){
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

  }]);