'use strict';

const loginFormInit = {
  email: {
    value: null,
    message: null,
    isValid: false
  },
  password: {
    value: null,
    message: null,
    isValid: false
  },
  isLoading: false,
  isActive: true,
  errorMessage: null
}

const signupFormInit = {
  email: {
    value: null,
    message: null,
    isValid: false
  },
  password: {
    value: null,
    message: null,
    isValid: false
  },
  passwordConfirm: {
    value: null,
    message: null,
    isValid: false
  },
  isLoading: false,
  isActive: false,
  errorMessage: null
}

angular.module('movilistApp').component('authForm', {
  templateUrl: 'app/common/authForm.html',
  controller: 'AuthFormCtrl'
}).controller('AuthFormCtrl', ['$scope', '$firebaseAuth', '$location', 'utils', 'toast',
  function ($scope, $firebaseAuth, $location, utils, toast) {
    const auth = $firebaseAuth();
    $scope.closeAuthForm = $scope.$parent.$parent.closeAuthForm;

    $scope.loginForm = angular.copy(loginFormInit);
    $scope.signupForm = angular.copy(signupFormInit);

    // LOGIN FORM
    $scope.isLoginFormValid = function () {
      return $scope.loginForm.password.isValid
        && $scope.loginForm.email.isValid;
    };

    $scope.validateLoginEmail = function () {
      const email = $scope.loginForm.email.value;
      if (!email || !utils.validateEmail(email)) {
        $scope.loginForm.email.message = "Please enter valid email address.";
        $scope.loginForm.email.isValid = false;
      } else {
        $scope.loginForm.email.message = null;
        $scope.loginForm.email.isValid = true;
      }
    };

    $scope.validateLoginPassword = function () {
      const password = $scope.loginForm.password.value;
      if (password.length < 6) {
        $scope.loginForm.password.message = "Password must be at least 6 characters long.";
        $scope.loginForm.password.isValid = false;
      } else {
        $scope.loginForm.password.message = null;
        $scope.loginForm.password.isValid = true;
      };
    };

    $scope.handleLogin = function () {
      if (!$scope.isLoginFormValid()) {
        return;
      }
      const email = $scope.loginForm.email.value;
      const password = $scope.loginForm.password.value;
      $scope.loginForm.isLoading = true;
      auth.$signInWithEmailAndPassword(email, password)
        .then(function (firebaseUser) {
          $scope.loginForm = angular.copy(loginFormInit);
          $scope.closeAuthForm();
          $location.path('/list/' + firebaseUser.user.uid);
          toast.showSuccess('Welcome back, ' + firebaseUser.user.email + '!')
        }).catch(function (error) {
          $scope.loginForm.isLoading = false;
          $scope.loginForm.errorMessage = error.message;
          toast.showDanger(error.message)
        })
    };

    $scope.handleGoogleSignin = function () {
      auth.$signInWithPopup("google").then(function (firebaseUser) {
        $scope.loginForm = angular.copy(loginFormInit);
        $scope.signupForm = angular.copy(signupFormInit);
        $scope.closeAuthForm();
        $location.path('/list/' + firebaseUser.user.uid);
        toast.showSuccess('Welcome, ' + firebaseUser.user.email + '!')
      }).catch(function (error) {
        toast.showDanger(error.message)
      });
    }



    // SIGNUP FORM
    $scope.isSignupFormValid = function () {
      return $scope.signupForm.email.isValid
        && $scope.signupForm.password.isValid
        && $scope.signupForm.passwordConfirm.isValid;
    };

    $scope.validateSignupEmail = function () {
      const email = $scope.signupForm.email.value;
      if (!email || !utils.validateEmail(email)) {
        $scope.signupForm.email.message = "Please enter valid email address.";
        $scope.signupForm.email.isValid = false;
      } else {
        $scope.signupForm.email.message = null;
        $scope.signupForm.email.isValid = true;
      }
    };

    $scope.validateSignupPassword = function () {
      const password = $scope.signupForm.password.value;
      if (password.length < 6) {
        $scope.signupForm.password.message = "Password must be at least 6 characters long.";
        $scope.signupForm.password.isValid = false;
      } else {
        $scope.signupForm.password.message = null;
        $scope.signupForm.password.isValid = true;
      };
    };

    $scope.validateSignupPasswordConfirm = function () {
      const passwordConfirm = $scope.signupForm.passwordConfirm.value;
      const password = $scope.signupForm.password.value;
      if (passwordConfirm.length < 6) {
        $scope.signupForm.passwordConfirm.message = "Password confirm must be at least 6 characters long.";
        $scope.signupForm.passwordConfirm.isValid = false;
      } else if (passwordConfirm !== password) {
        $scope.signupForm.passwordConfirm.message = "Passwords must match.";
        $scope.signupForm.passwordConfirm.isValid = false;
      } else {
        $scope.signupForm.passwordConfirm.message = null;
        $scope.signupForm.passwordConfirm.isValid = true;
      };
    };

    $scope.handleSignup = function () {
      if (!$scope.isSignupFormValid()) {
        return;
      }
      const email = $scope.signupForm.email.value;
      const password = $scope.signupForm.password.value;
      $scope.signupForm.isLoading = true;
      auth.$createUserWithEmailAndPassword(email, password)
        .then(function (firebaseUser) {
          $scope.signupForm = angular.copy(signupFormInit);
          $scope.closeAuthForm();
          $location.path('/list/' + firebaseUser.user.uid);
          toast.showSuccess('Welcome, ' + firebaseUser.user.email + '!')
        }).catch(function (error) {
          $scope.signupForm.isLoading = false;
          $scope.signupForm.errorMessage = error.message;
          toast.showDanger(error.message)
        });
    }

    $scope.setActiveTab = function (tabName) {
      $scope.loginForm.isActive = false;
      $scope.signupForm.isActive = false;
      switch (tabName) {
        case 'Login':
          $scope.loginForm.isActive = true;
          break;
        case 'Signup':
          $scope.signupForm.isActive = true;
          break;
        default: '';
      }
    }
  }
]);
