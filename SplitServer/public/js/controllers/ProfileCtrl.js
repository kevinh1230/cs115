var app = angular.module('ProfileCtrl', [])
app.controller('ProfileController', function ($scope, $http, $location) {

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
                        $scope.chargedBills = bills;
                    });
                else 
                    console.log('Fail to get bills');
        });
    }

    $scope.checkUnpaid = function(user, bill){
        $scope.user = user;
        for(var i in bill.unpaid){
            if(user.username == bill.unpaid[i].username){
                return true;
            }
        }
        return false;
    }
});

app.controller('createBill', function($scope, $modal, $log) {
    $scope.bill = {
        subject: "",
        amount: "",
        debters: "",
    }


    $scope.openCreateBill = function(size) {

        console.log("open");

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/createBill.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                bill: function() {
                    return $scope.bill;
                }
            }
        });

        modalInstance.result.then(function() {}, function() {
            $log.info('ModalInstanceCtrl dismissed at: ' + new Date() + "create");
        });
    };
});

app.controller('ModalInstanceCtrl', function($scope, $modalInstance, bill, $http, $location) {
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

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('payBillModal', function($scope, $modal, $log) {
    $scope.pay = {
        status: "",
        method: ""
    }

    $scope.openPayBill = function(bill) {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/payBillModal.html',
            controller: 'payBillModalInstanceCtrl',
            resolve: {
                pay: function() {
                    return $scope.pay;
                },
                bill: function() {
                    return bill;
                }
            }
        });

        modalInstance.result.then(function() {
            //$scope.user = {}; //reset form
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

app.controller('payBillModalInstanceCtrl', function($scope, $modalInstance, pay, bill) {
    $scope.pay = pay;
    $scope.bill = bill;
    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('addFriend', function($scope, $modal, $log) {

    $scope.openAddFriend = function() {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/addFriend.html',
            controller: 'AddFriendModalInstanceCtrl',
            resolve: {
                user: function() {
                    return $scope.user;
                }
            }
        });

        modalInstance.result.then(function() {
            //$scope.user = {}; //reset form
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('AddFriendModalInstanceCtrl', function($scope, $modalInstance, user, $http) {
    $scope.user = user;

    $scope.acceptFriend = function(friend) {
        console.log(friend);
        $http.put('/acceptFriend', {
                friend: friend
            })
            .success(function(user) {
                $scope.user = user;
            });
    }

    $scope.addFriend = function(friend) {
        $http.post('/addFriend', {
                friend: friend
            })
            .success(function(user) {
                $scope.user = user;
                $scope.aFriend = '';
            });
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('ownedBills', function($scope, $modal, $log) {

    $scope.openOwnedBill = function(bill) {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/ownedBills.html',
            controller: 'ownedBillsModalInstanceCtrl',
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
});

app.controller('ownedBillsModalInstanceCtrl', function($scope, $modalInstance, bill) {
    $scope.bill = bill;
    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('paidBills', function($scope, $modal, $log) {

    $scope.openPaidBill = function(bill) {

        var modalInstance = $modal.open({
            templateUrl: '/views/profileModal/paidBills.html',
            controller: 'paidBillsModalInstanceCtrl',
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
});

app.controller('paidBillsModalInstanceCtrl', function($scope, $modalInstance, bill) {
    $scope.bill = bill;
    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
