angular.module('MainCtrl', []).controller('MainController', function($scope) {

	$http.get('/auth').success(function(data){
		if (data == false){
			$location.url('/profile');
		}
	})
	

});