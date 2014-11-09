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
			console.log(user);
            console.log(JSON.stringify(user.friends));
		});

	$http.get('/getOwnedBills').success(function(bills){
		$scope.ownedBills = bills;
	})

	$http.get('/getChargedBills').success(function(bills){
		console.log('Get Charged Bills');
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
});

app.controller('createBill', function ($scope, $modal, $log) {
    $scope.bill = {title: "",
      type: "",
      splitters:"",
      amount:"",
      comments:"",
     }


  $scope.openCreateBill = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'createBill.html',
      controller: 'ModalInstanceCtrl',
      size: size,
       resolve: {
         bill: function () {
          return $scope.bill;
         }
       }
    });

   modalInstance.result.then(function () {
       //$scope.bill = bill;
    }, function () {
      $log.info('ModalInstanceCtrl dismissed at: ' + new Date() + "create");
    });
  };
  });

  app.controller('ModalInstanceCtrl', function ($scope, $modalInstance,bill) {
    $scope.bill = bill;
    $scope.ok = function () {
      $modalInstance.close();
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

  app.controller('payBill', function ($scope, $modal, $log){
    $scope.pay = {status: "", method: ""}

    $scope.openPayBill = function () {

      var modalInstance = $modal.open({
        templateUrl: 'payBill.html',
        controller: 'payBillModalInstanceCtrl',
        resolve: {
          pay: function () {
            return $scope.pay;
          }
        }
      });

      modalInstance.result.then(function () {
        //$scope.user = {}; //reset form
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  });

  app.controller('payBillModalInstanceCtrl', function ($scope, $modalInstance, pay) {
    $scope.pay = pay;
    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

  app.controller('addFriend', function ($scope, $modal, $log) {

    $scope.user = {name: "",friend:""}

    $scope.openAddFriend = function () {

      var modalInstance = $modal.open({
        templateUrl: 'addFriend.html',
        controller: 'AddFriendModalInstanceCtrl',
        resolve: {
          user: function () {
            return $scope.user;
          }
        }
      });

      modalInstance.result.then(function () {
        //$scope.user = {}; //reset form
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

  app.controller('AddFriendModalInstanceCtrl', function ($scope, $modalInstance, user,$http) {
    $scope.user = user;
    console.log("hi")
    $scope.addFriend = function ( friend ) {
      $http.post('/addFriend', { friend: friend })
       .success(function(user) {
        $scope.user = user;
        $scope.aFriend = '';
       });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
 
