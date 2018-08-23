angular.module('reg')
  .factory('AuthService', [
    '$http',
    '$rootScope',
    '$state',
    '$window',
    'Session',
    function($http, $rootScope, $state, $window, Session) {
      var authService = {};
      var userCount = {};

      function startLoginTimer(data, cb) {
        return window.setTimeout(function() {
          if (!Session.isLoggedOut(data.user)) {
            sweetAlert({
              title: "Session expire soon",
              text: "You are about to be logged out in 10 minutes, save your application!",
              type: "warning",
              confirmButtonColor: "#00c3b5",
              confirmButtonText: "I need more time",
              showCancelButton: true,
            }, cb);
          }
        }, 1800000);
      }

      function startLogoutTimer(data) {
        return window.setTimeout(function(){
          if (!Session.isLoggedOut(data.user)) {
            authService.logout();
          }
        }, 2400000);
      }

      function loginSuccess(data, cb){
        Session.create(data.token, data.user);
        userCount[data.user] = {};

        var handleRedirect = function() {

          clearTimeout(userCount[data.user].loginCount);
          clearTimeout(userCount[data.user].logoutCount);

          userCount[data.user].loginCount = startLoginTimer(data, handleRedirect);
          userCount[data.user].logoutCount = startLogoutTimer(data);
        };

        userCount[data.user].loginCount = startLoginTimer(data, handleRedirect);
        userCount[data.user].logoutCount = startLogoutTimer(data);

        if (cb){
          cb(data.user);
        }
      }

      function loginFailure(data, cb){
        $state.go('login');
        if (cb) {
          cb(data);
        }
      }

      authService.loginWithPassword = function(email, password, onSuccess, onFailure) {
        return $http
          .post('/auth/login', {
            email: email,
            password: password
          })
          .success(function(data){
            loginSuccess(data, onSuccess);
          })
          .error(function(data){
            loginFailure(data, onFailure);
          });
      };

      authService.loginWithToken = function(token, onSuccess, onFailure){
        return $http
          .post('/auth/login', {
            token: token
          })
          .success(function(data){
            loginSuccess(data, onSuccess);
          })
          .error(function(data, statusCode){
            if (statusCode === 400){
              Session.destroy(loginFailure);
            }
          });
      };

      authService.logout = function(callback) {

        swal("See you!", "You are logged out!", "success");
        // Clear the session
        Session.destroy(callback);
        $state.go('login');
      };

      authService.register = function(email, password, onSuccess, onFailure) {
        return $http
          .post('/auth/register', {
            email: email,
            password: password
          })
          .success(function(data){
            loginSuccess(data, onSuccess);
          })
          .error(function(data){
            loginFailure(data, onFailure);
          });
      };

      authService.verify = function(token, onSuccess, onFailure) {
        return $http
          .get('/auth/verify/' + token)
          .success(function(user){
            Session.setUser(user);
            if (onSuccess){
              onSuccess(user);
            }
          })
          .error(function(data){
            if (onFailure) {
              onFailure(data);
            }
          });
      };

      authService.resendVerificationEmail = function(onSuccess, onFailure){
        return $http
          .post('/auth/verify/resend', {
            id: Session.getUserId()
          });
      };

      authService.sendResetEmail = function(email){
        return $http
          .post('/auth/reset', {
            email: email
          });
      };

      authService.resetPassword = function(token, pass, onSuccess, onFailure){
        return $http
          .post('/auth/reset/password', {
            token: token,
            password: pass
          })
          .success(onSuccess)
          .error(onFailure);
      };

      return authService;
    }
  ]);
