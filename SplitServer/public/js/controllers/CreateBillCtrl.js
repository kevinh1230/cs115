angular.module('CreateBillCtrl', ['ngTagsInput']).service('friends', function($http, $q) { 
	var friends = [];
	        
	this.load = function() {

		$http.get('/user').success(function(user) {
			for (var friend in user.friends){
				var name = user.friends[friend].username;
				friends.push({ text : name });
			}
		});
		var deferred = $q.defer();
		deferred.resolve(friends);
		return deferred.promise;
	};

	this.clear = function() {
		friends = [];
	}

	this.getFriends = function() {
		return friends;
	}

}).controller('CreateBillController', function($scope, $http, $location, friends) {

	$http.get('/auth').success(function(data) {
		if(data == false)
			$location.url('/');
		});

	
	$scope.debterList = [];
	$scope.loadFriends = function(query) {
		var friendList = friends.load();
		friends.clear();
		return friendList;
	}

	$scope.verifyTag = function(tag) {
		console.log(tag.text);
		var friendList = friends.getFriends();
		if (!containsObject(tag, friendList)) {
            var index = $scope.debterList.indexOf(tag);
            if (index > -1)
            	$scope.debterList.splice(index, 1);
		}
		
	}

	$scope.createBill = function(subject, amount) {
		console.log('create')
		console.log($scope.debterList);
		var debters = $scope.debterList;
		$http.post('/createbill', {subject : subject, amount : amount, debters : debters})
			.success(function(data) {
				$location.url('/profile');
			 });
	}
});

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].text === obj.text) {
            return true;
        }
    }

    return false;
}
