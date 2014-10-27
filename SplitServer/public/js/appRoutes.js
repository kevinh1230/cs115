angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupController'
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})

		.when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'ProfileController'
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
