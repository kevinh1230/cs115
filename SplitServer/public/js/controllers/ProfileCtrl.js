angular.module('ProfileCtrl', []).controller('ProfileController', function($scope, $http, $location) {

	$http.get('/user').success(function(user) {
			$scope.user = user;
			console.log(user);
            console.log(JSON.stringify(user.friends));
		});

	$http.get('/getOwnedBills').success(function(bills){
		$scope.ownedBills = bills;
	})

	$http.get('/getChargedBills').success(function(bills){
		console.log(bills);
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
		$http.post('/addFriend', { friend: friend })
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

    $scope.payBill = function(bill) {
        console.log(bill);
        $http.put('/payBill', { bill: bill })
             .success(function(bills) {
                $scope.chargedBills = bill;
             });
    }
});
