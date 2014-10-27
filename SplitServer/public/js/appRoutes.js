angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController',
			title: 'SPLIT'
		})

		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupController',
			title: 'SIGN UP'
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginController',
			title: 'LOGIN'
		})

		.when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'ProfileController',
			title: 'PROFILE'
		})

		.when('/nerds', {
			templateUrl: 'views/nerd.html',
			controller: 'NerdController'
		})

		.when('/createBill', {
			templateUrl: 'views/createbill.html',
			controller: 'GeekController'	
		});

	$locationProvider.html5Mode(true);

}]);
