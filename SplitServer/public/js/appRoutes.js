angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	
	// Rediect to profile page if user is already autheniticated
	this.isAuth = function(route, redirect) {
		return function($q, $http, $location) {
		var defer = $q.defer();
		var redirectOnAuth = function(re) {
			if (re) {
				defer.resolve();
			} else {
				defer.reject();
				$location.url(route);
			}
		
		}
		$http.get('/auth').success(function(data) {
			if (data) {
				redirectOnAuth(!redirect);
			} else {
				redirectOnAuth(redirect);
			}
		});
		return defer.promise;
		}
	}

/*	this.isAuth = function($q, $http) {
		var defer = $q.defer();
		$http.get('/auth').success(function(data) {
			defer.resolve(data);
		});
		return defer.promise;
	}
*/

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController',
			title: 'SPLIT',
			resolve: {
				auth: isAuth('/profile', true)
			}
		})

		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupController',
			title: 'SIGN UP',
			resolve: {
				auth: isAuth('/profile', true)
			}
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginController',
			title: 'LOGIN',
			resolve:  {
				auth: isAuth('/profile', true)
			}
		})

		.when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'ProfileController',
			title: 'PROFILE',
			resolve: {
				auth: isAuth('/login', false)
			}
		})

		.when('/createbill', {
			templateUrl: 'views/createbill.html',
			controller: 'CreateBillController'	
		})

		.when('/dashboard', {
			templateUrl: 'views/dashboard.html',
			controller: 'DashBoardController',
			title: 'DASHBOARD'
		})
		
		.when('/404', {
			templateUrl: 'views/404.html',
		})
		
		.otherwise( {
			redirectTo: '/404'
		});

	$locationProvider.html5Mode(true);

}]);
