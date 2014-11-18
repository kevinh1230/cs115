var app = angular.module('ProfileCtrl', [])
app.controller('ProfileController', function ($scope, $http, $location, $modal, $log) {

    this.tab = 1;

    this.setTab = function(newValue){
      this.tab = newValue;
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };

    $http.get('/user').success(function(user) {
        $scope.user = user;
    });

	$http.get('/getOwnedBills').success(function(bills){
		$scope.ownedBills = bills;
	})

	$http.get('/getChargedBills').success(function(bills){
        $scope.chargedBills = bills;
	})
   
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

    $scope.checkUnpaid = function(user, bill){
        for(var i in bill.unpaid){
            if(user.username == bill.unpaid[i].username){
                return true;
            }
        }
        return false;
    }

    //code to open modals

    $scope.openCreateBill = function() {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/createBill.html',
            controller: 'BillModalInstanceCtrl',
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
            controller: 'BillModalInstanceCtrl',
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
            controller: 'BillModalInstanceCtrl',
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
            controller: 'BillModalInstanceCtrl',
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

    $scope.openAddFriend = function() {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/addFriend.html',
            controller: 'UserModalInstanceCtrl',
            resolve: {
                user: function() {
                    return $scope.user;
                }
            }
        });

        modalInstance.result.then(function() {
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

//bill function controller
app.controller('BillModalInstanceCtrl', function($scope, $modalInstance, bill, $http, $location) {
    $scope.bill = bill;

    $http.get('/auth').success(function(data) {
        if (data == false)
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
        $http.post('/createbill', {
                subject: subject,
                ammount: ammount,
                debters: debters
            })
            .success(function(data) {
                $location.url('/profile');
            });
        $modalInstance.close();
    }

    $scope.payBillButton = function() {
        $scope.payBill(bill);
        $modalInstance.close();
    };

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
 });

//friend function controller
app.controller('UserModalInstanceCtrl', function($scope, $modalInstance, user, $http, $location) {
    $scope.user = user;

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
                $modalInstance.close();
            })
            .error(function (message) {
                $scope.message = message;
            });
        $scope.aFriend = null;
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
