'use strict';

angular.module('ctrls.createctrl', [])

.controller("createCtrl", function($scope,$rootScope, $firebase, $location,$window,Authenticator){

	$scope.isLoggedIn = $rootScope.isLoggedIn;

	$scope.email = Authenticator.getUser();

	$scope.ticketTypes = [
		{
			'id' : 1,
			'text' : 'Mobile Website'
		},
		{
			'id' : 2,
			'text' : 'Mobile App'
		},
		{
			'id' : 3,
			'text' : 'Website'
		}
	]

	var fireBase = new Firebase("https://ticket-sample.firebaseio.com/tickets");
	
	$scope.create = function(){

		$scope.showError = false;

		if(!$scope.createForm.$valid){

			$scope.showError = true;
			$scope.errorMsg = "Please fill in all details"
			return;
		}

		var obj = {

			name : $scope.name,
			email : $scope.email,
			phone : $scope.phone,
			subject : $scope.subject,
			type : $scope.ticketType,
			description : $scope.description,
			date : Firebase.ServerValue.TIMESTAMP
		}

		var tickets = $firebase(fireBase.child("tickets")).$asArray();
		tickets.$add(obj).then(function(data){

			$scope.showError = false;
			$window.location.reload();
		}, function(err){

			$scope.showError = true;
			$scope.errorMsg = "Something went wrong. Please try again later"
		})
	}
})

.controller("ticketsListCtrl", function($scope,$rootScope,$firebase,$location){

	$scope.isLoggedIn = $rootScope.isLoggedIn
	
	var tickets = "";
	var ticketsArr = [] 
	var fireBase = new Firebase("https://ticket-sample.firebaseio.com/tickets");

	fireBase.on("value", function(snapshot) {
	  
		tickets = snapshot.val();
		$scope.tickets = tickets["tickets"];
		var keys = Object.keys($scope.tickets);

		for(var i=0;i<keys.length;i++){


			ticketsArr.push($scope.tickets[keys[i]])
		}
		$scope.ticketsFinal = ticketsArr;

	}, function (errorObject) {

	  	console.log("The read failed: " + errorObject.code);
	});
})