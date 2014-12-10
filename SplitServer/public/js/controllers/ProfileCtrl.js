var app = angular.module('ProfileCtrl', ['ngTagsInput', 'FriendsModalCtrl', 'BillsModalCtrl']).service('friends', function($http, $q) { 
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
})
app.controller('ProfileController', function ($scope, $http, $location, $modal, $log) {

        $scope.cityImage = {
        'background-image': 'url(../city.jpg)'
    };

    console.log($scope.cityImage); 
    var tab = 1;

    $scope.setTab = function(newValue){
        tab = newValue;
    };

    $scope.isSet = function(tabName){
        return tab === tabName;
    };

    $http.get('/user').success(function(user) {
        $scope.user = user;
        if (!user.venmoAuthed) {
            var venmoAuthCode = $location.search();
            $http.post('/accesstoken', {code: venmoAuthCode.code})
            .success(function(data) {
                $scope.message = data;
            })
            .error(function(message) {
                $scope.message = message;
            })
        }
    });

	$http.get('/getOwnedBills').success(function(bills){
		$scope.ownedBills = bills;
	})

	$http.get('/getChargedBills').success(function(bills){
        $scope.chargedBills = bills;
	})
    
    $scope.setMessage = function(message) {
        $scope.message = message;
    }

    $scope.clearMessage = function() {
        delete $scope.message;
    }

	$scope.acceptFriend = function(friend) {
	    $http.put('/acceptFriend', {friend: friend})
	        .success(function(data) {
	            $scope.user = data.user;
                $scope.message = data.message
	        })
            .error(function(message) {
                $scope.message = message;
            });
	}

	$scope.addFriend = function(friend) {
	    $http.post('/addFriend', { friend: friend })
	        .success(function(data) {
	            $scope.user = data.user;
                $scope.message = data.message
            })
            .error(function (message) {
                $scope.message = message;
            });
        $scope.aFriend = null;
	}

	$scope.deleteFriend = function(friend) {
	    $http.delete('/deleteFriend/' + friend)
	        .success(function(data) {
	            $scope.user = data.user;
                $scope.message = data.message
	        })
            .error(function (message) {
                $scope.message = message;
            });
	        $scope.dFriend = null;
	}

	$scope.logout = function() {
        $http.get('/logout')
            .success(function() {
                $location.url('/');			 
        });
	}

    $scope.createBill = function(subject, amount, debterList) {
        console.log('create')
        console.log($scope.debterList);
        var debters = debterList;
        $http.post('/createbill', {subject : subject, amount : amount, debters : debters})
            .success(function(data) {
                $http.get('/getOwnedBills').success(function(bills){
                    console.log(bills)
                    $scope.ownedBills = bills;
                    return true;
                })
                .error(function () {
                    return false
                });
             })
             .error(function () {
                return false;   
             });
    }

    $scope.payBill = function(bill) {
        $http.put('/payBill', { bill: bill })
            .success(function(response) {
                if (response)
                    $http.get('/getChargedBills').success(function(bills){
                        console.log(bills)
                        $scope.chargedBills = bills;
                    });
                else 
                    console.log('Fail to get bills');
        });
    }

    $scope.deleteBill = function(bill) {
        $http.post('/deleteBill', { bill: bill })
            .success(function(response) {
                console.log(response); 
                if (response) 
                    $http.get('/getOwnedBills').success(function(bills){
                        console.log(bills)
                        $scope.ownedBills = bills;
                    });
            });
    }
    $scope.checkUnpaid = function(user, bill){
        return bill.group.some(function(friend) {
            if(!friend.paid && user._id == friend.user._id) {
                return true;
            }
        });
    }

//code to open modals

    $scope.openCreateBill = function() {
        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/createBill.html',
            controller: 'BillsModalController',
            scope: $scope,
            resolve: {
                bill: function() {
                    return $scope.bill;
                }
            }
        });

        modalInstance.result.then(function() {
        }, function() {
            $log.info('Modal dismissed at: ' + new Date() + "create");
        });
    };

    $scope.openPayBill = function(bill) {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/payBillModal.html',
            controller: 'BillsModalController',
            scope: $scope,
            resolve: {
                bill: function() {
                    return bill;
                }
            }
        });

        modalInstance.result.then(function() {
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.openOwnedBill = function(bill) {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/ownedBills.html',
            controller: 'BillsModalController',
            scope: $scope,
            resolve: {
                bill: function() {
                    return bill;
                }
            }
        });

        modalInstance.result.then(function() {}, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.openPaidBill = function(bill) {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/paidBills.html',
            controller: 'BillsModalController',
            resolve: {
                bill: function() {
                    return bill;
                }
            }
        });

        modalInstance.result.then(function() {}, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.isPaid = function(bill) {
        for (var user in bill.group) {
            if (bill.group[user].paid === false) {
                console.log(bill);
                return false;
            }
        }
        return true;
    }

    $scope.openAddFriend = function() {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/addFriend.html',
            controller: 'FriendsModalController',
            scope: $scope
        });

        modalInstance.result.then(function() {}, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});
