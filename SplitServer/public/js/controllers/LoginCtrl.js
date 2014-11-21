angular.module('LoginCtrl', []).controller('LoginController', function($scope, $http, $location, $window) {

	$scope.login = function (username, password) {
		$http.post('/login', {username: username, password: password})
	        .success(function(response) {
                if (response){
                    $location.url('/profile');

                }
                    
            })
            .error(function(message) {
                $scope.message = message;
            });
    }	
});
