angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	
	// Rediect to profile page if user is already autheniticated
	this.isAuth = function($q, $http, $location) {
		$http.get('/auth').success(function(data) {
			if (data) {
				$location.url('/profile');
				return $q.reject();
			} else {
				if($location.url() == '/profile') {
					$location.url('/login');
					return $q.reject();
				}
			}
		});
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
				auth: isAuth
			}
		})

		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupController',
			title: 'SIGN UP',
			resolve: {
				auth: isAuth
			}
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginController',
			title: 'LOGIN',
			resolve:  {
				auth: isAuth
			}
		})

		.when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'ProfileController',
			title: 'PROFILE',
			resolve: {
				auth: isAuth
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
