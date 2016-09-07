var app = angular.module('angularTest', ['ngRoute', 'firebase', 'ui.bootstrap',
                          'ctrls.logictrl', 'ctrls.createctrl']);

'use strict';

app.config(['$routeProvider', function($routeProvider, $urlRouterProvider){

	$routeProvider

	.when('/tickets/create', {

    	templateUrl: 'templates/create.html',
      	controller: 'createCtrl',
      	private : true
    })
    .when('/tickets/all', {

    	templateUrl: 'templates/list.html',
      	controller: 'ticketsListCtrl',
      	private : true
    })
    .when('/login', {

    	templateUrl : 'templates/login.html',
    	controller : 'loginCtrl',
    	private : false
    })
    .otherwise({

        redirectTo: '/login'
    });
}]);

app.factory('Authenticator', function($rootScope){

  return{

    setUser : function(user){

      return localStorage.setItem("user", user)
    },
    getUser : function(){

      return localStorage.getItem("user")
    },
    removeUser : function(){

      localStorage.removeItem("user");
    },
  }
});

app.run(function ($rootScope,$location,$route, Authenticator, $window) {

 	$rootScope.$on('$routeChangeStart', function(event, next, current) {

    	if(!Authenticator.getUser()) {

        $rootScope.isLoggedIn = false;
      	$window.location.href = '#/login';
    	}else{

        $rootScope.isLoggedIn = true;
    		// $window.location.href = '#/tickets/create';
    	}
  	});
});

app.directive('navBar', function(){

	return{

		templateUrl : 'templates/navbar.html'
	}
});