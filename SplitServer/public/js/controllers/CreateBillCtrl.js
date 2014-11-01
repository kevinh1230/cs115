angular.module('CreateBillCtrl', [ 'decipher.tags' ,'ui.bootstrap' ]).controller('CreateBillController', function($scope, $http, $location) {
	
	$http.get('/auth').success(function(data) {
		if(data == false)
			$location.url('/');
		});
	
	$scope.debterList = [];
	
	$http.get('/user').success(function(user) {
			$scope.user = user;
			$scope.friends = user.friends;
			console.log($scope.friends);
		});

	$scope.createBill = function(subject, ammount, debters) {
		console.log('create')
		console.log(debters);
		$http.post('/createbill', {subject : subject, ammount : ammount, debters : debters})
			.success(function(data) {
				$location.url('/profile');
			 });
	}
});

