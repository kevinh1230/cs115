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

		.when('/createbill', {
			templateUrl: 'views/createbill.html',
			controller: 'CreateBillController'	
		})

		.when('/dashboard', {
			templateUrl: 'views/dashboard.html',
			controller: 'DashBoardController',
			title: 'DASHBOARD'
		});

	$locationProvider.html5Mode(true);

}]);
