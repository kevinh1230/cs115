angular.module('LoginCtrl', []).controller('LoginController', function($scope, $http, $location) {

	$scope.login = function (username, password) {
		$http.post('/login', {username: username, password: password})
	         .success(function(data) {
				 console.log(data);
			 });
    }	
});
