angular.module('ProfileCtrl', []).controller('ProfileController', function($scope, $http, $location) {
	$http.get('/auth').success(function(data) {
		if(data == false)
			$location.url('/login');
		});

	$http.get('/user').success(function(user) {
			$scope.user = user;
		});

	$scope.acceptFriend = function(friend) {
		console.log(friend);
		$http.put('/acceptFriend', {friend: friend})
			 .success(function(user) {
				$scope.user = user;
			 });
	}

	$scope.addFriend = function(friend) {
		$http.post('/addFriend2', { friend: friend })
			 .success(function(user) {
				$scope.user = user;
				$scope.aFriend = '';
			 });
	}

	$scope.deleteFriend = function(friend) {
		$http.delete('/deleteFriend/' + friend)
			 .success(function(user) {
				$scope.user = user;
				$scope.dFriend = '';
			 });
	}
});
