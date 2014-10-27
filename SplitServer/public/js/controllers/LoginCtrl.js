angular.module('LoginCtrl', []).controller('LoginController', function($scope, $http, $location) {
	$http.get('/auth').success(function(data) {
		if(data == true)
			$location.url('/profile');
	});

	$scope.login = function (username, password) {
		$http.post('/login', {username: username, password: password})
	         .success(function(data) {
				 console.log(data);
			 });
    }	
});
