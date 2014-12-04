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

    $scope.tab = 1;

    $scope.setTab = function(newValue){
      $scope.tab = newValue;
    };

    $scope.isSet = function(tabName){
      return $scope.tab === tabName;
    };

    this.activeButton = 1;

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

   $scope.clearBill = function() {
        $scope.ownedBills = [];
        $scope.chargedBills = [];
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

    $scope.createBill = function(subject, amount, debters){
        //debterList = [];
        console.log('create');
        //console.log(debterList);
        //var debters = debterList;
        $http.post('/createbill', {subject : subject, amount : amount, debters : debters})
            .success(function(response) {
                console.log(response); 
                    if (response) 
                        $http.get('/getOwnedBills').success(function(bills){
                            console.log(bills)
                            $scope.ownedBills = bills
                        });
                console.log(response);
         });
    console.log("inprofctrl");
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
        controller: 'BillModalInstanceCtrl',
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

$scope.modifiable = function() {
    return bill.group.some( function(e) {
        return e.paid;
    });
}

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

    $scope.createBillButton = function(subject, ammount) {
        var success = $scope.createBill(subject, ammount, $scope.debterList);
        if (success)
            $modalInstance.close();
    }
    

    $scope.deleteBillButton = function() {
        $scope.deleteBill(bill);
        $modalInstance.close();
    }

    $scope.updateBill = function(subject, amount) {
        var debters = $scope.debterList;
        console.log($scope.bill);
        $http.post('/deleteBill', { bill: $scope.bill }).success(function() {
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
        $scope.amount = bill.amount;
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
