angular.module('MainCtrl', []).controller('MainController', function($scope, $http, $location) {

	$http.get('/auth').success(function(data){
		if (data == true){
			$location.url('/profile');
		}
	})
	

});