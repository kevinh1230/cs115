angular.module('NerdCtrl', []).controller('NerdController', function($scope, $http) {

	$scope.user = function() {
		var url = 'http://localhost:8080/profile'
		$http.get(url).success(function(data) {
			$scope.line = data;
		});
	}
	
	$scope.user();
});