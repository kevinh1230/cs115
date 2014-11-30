var app = angular.module('ProfileCtrl', ['ngTagsInput']).service('friends', function($http, $q) { 
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

    this.tab = 1;

    this.setTab = function(newValue){
      this.tab = newValue;
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };

    this.setButton = function(newButtonValue){
      this.activeButton = newButtonValue;
    };

    this.isSetButton = function(buttonName){
      return this.activeButton === buttonName;
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
            //location.reload();
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

//bill function controller
app.controller('BillModalInstanceCtrl', function($scope, $modalInstance, bill, $http, $location, friends) {

    $scope.bill = bill;

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
        $modalInstance.close();
    }

    $scope.deleteBill = function() {
	    $http.delete('/deleteBill/' + $scope.bill)
	        .success(function(data) {
                $modalInstance.close();
	        })
            .error(function (message) {
                $scope.message = message;
            });
    }

    $scope.updateBill = function(subject, amount) {
        var debters = $scope.debterList;
        $http.delete('/deleteBill/' + $scope.bill).success(function() {
            $http.post('/createbill', {subject : subject, amount : amount, debters : debters})
                 .success(function(data) {
                    $modalInstance.close();
                 })
                 .error(function(message) {
                    $scope.message = message;
                 });
        })
        .error(function(message) {
            $scope.message = message;
        });
    }

    function containsObject(obj, list) {
       var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].text === obj.text) {
                return true;
            }
        }
        return false;
    }

    $scope.payBillButton = function() {
        var confirmation = confirm("Are you sure you want to pay this bill?");
        if(confirmation==true){
            $scope.payBill(bill);
            console.log("confirmed click")
            $modalInstance.close();
        } else {
            console.log("unconfirmed")
            $modalInstance.close();
        }
    };
    
    $scope.edit = function () {
        $scope.editBill = true;
        $scope.subject = bill.subject;
        console.log($scope.bill);
        $scope.amount = bill. amount;
        $scope.bill.group.forEach(function(charge) {
            $scope.debterList.push({ 'text': charge.user.username, 'amount': charge.amount });
        });
    }
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

    $http.get('/getUsers', { params: { search: "Jesse" } })
        .success(function(users) { 
            $scope.users = users;
            console.log(users)
        });
    
    $scope.searchFilter = function (obj) {
        var input = $scope.search.input.$viewValue;
        var regex = new RegExp(String(input).replace(/\s/g,""), 'i');
        return !input ||
                regex.test(obj.firstName + obj.lastName) || 
                regex.test(obj.username);
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
        if (!friend._id) return console.log("User does not exist");
        $http.post('/addFriend', { friend: friend })
            .success(function(data) {
                $scope.user = data.user;
                $scope.message = data.message
                $modalInstance.close();
            })
            .error(function (message) {
                $scope.message = message;
                $scope.aFriend = null;
            });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
