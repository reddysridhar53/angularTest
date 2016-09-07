'use strict';

angular.module('ctrls.logictrl', [])

.controller("loginCtrl", function($scope,$rootScope, $firebase, $location, Authenticator,$window){

	$rootScope.isLoggedIn = false;

	$scope.showError = false;
	$scope.showSuccess = false;

	var fireBase = new Firebase("https://ticket-sample.firebaseio.com");

	$scope.logIn = function(){

		if($scope.loginForm.$valid){

			fireBase.createUser({

			  	email    : $scope.email,
			  	password : $scope.password
			}, function(error, userData) {

			  	if (error) {
					$scope.showError = true;
			   		switch (error.code) {

				    	case "EMAIL_TAKEN":
				    		loginUser()
				        	break;
				      	case "INVALID_EMAIL":
				        	$scope.errorMsg = "The specified email is not a valid email.";
				        	break;
				      	default:
				        	$scope.errorMsg = "Error creating user:";
				    }
			  	}else {

				    $scope.showSuccess = true;
				    $scope.showError = false;
				    loginUser()
				}
			});
		}else{

			$scope.showError = true;
			$scope.errorMsg = "Please enter a valid email."
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

