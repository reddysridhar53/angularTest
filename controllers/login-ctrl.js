'use strict';

angular.module('ctrls.logictrl', [])

.controller("loginCtrl", function($scope,$rootScope, $firebase, $location, Authenticator,$window){

	$rootScope.isLoggedIn = false;

	$scope.loginPressed = false;
	$scope.showError = false;
	$scope.showLoader = false;

	var fireBase = new Firebase("https://ticket-sample.firebaseio.com");

	$scope.logIn = function(){

		$scope.loginPressed = true;
		$scope.showLoader = true;

		if($scope.loginForm.$valid){

			fireBase.createUser({

			  	email    : $scope.email,
			  	password : $scope.password
			}, function(error, userData) {

			  	if (error) {

					$scope.loginPressed = true;
					$scope.showLoader = false;
			  	}else {

				    loginUser()
				}
			});
		}else{

			$scope.showLoader = false;
			$scope.loginPressed = false;
			return;
		}
	}

	var loginUser = function(){


		fireBase.authWithPassword({

			email    : $scope.email,
			password : $scope.password
		}, function(error, authData) {
			
			if (error) {

			    $scope.showError = true;
			    $scope.errorMsg = error;
			} else {

				Authenticator.setUser($scope.email);
				$rootScope.isLoggedIn = true;
			    $window.location.href = '#/tickets/create'
			}
		}, {remember: "sessionOnly"}

		);
	}
})

.controller("rootCtrl", function($scope,$rootScope, $firebase, $location, Authenticator,$window){

	$scope.isLoggedIn = $rootScope.isLoggedIn;

	var fireBase = new Firebase("https://ticket-sample.firebaseio.com/tickets");

	$scope.useremail = Authenticator.getUser();

	$scope.logout = function(){

		fireBase.unauth();
		Authenticator.removeUser()
		$rootScope.isLoggedIn = false;
		$window.location.href = '#/login'
	};
})

