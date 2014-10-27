angular.module('CreateBillCtrl', []).controller('CreateBillController', function($scope, $http, $location) {
	$http.get('/auth').success(function(data) {
		if(data == false)
			$location.url('/');
		});

	$scope.createBill = function(subject, ammount, debters) {
		$http.post('/createbill', {subject : subject, ammount : ammount, debters : debters})
			.success(function(data) {
				$location.url('/profile');
			 });
	}
});