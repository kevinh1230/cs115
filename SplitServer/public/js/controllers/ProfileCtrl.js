angular.module('ProfileCtrl', []).controller('ProfileController', function($scope, $http, $location) {

	$http.get('/user').success(function(user) {
			$scope.user = user;
		});

	$http.get('/getOwnedBills').success(function(bills){
		$scope.ownedBills = bills;
	})

	$http.get('/getChargedBills').success(function(bills){
		$scope.chargedBills = bills;
	})

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

	$scope.logout = function() {
		$http.get('/logout')
			 .success(function() {
				$location.url('/');			 
			 });
	}
});
