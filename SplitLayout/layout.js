(function() {
   var app = angular.module('split', ['ui.bootstrap']);

  app.controller('TabController', function(){
    this.tab = 1;

    this.setTab = function(newValue){
      this.tab = newValue;
    };

    this.isSet = function(tabName){
      return this.tab === tabName;
    };
  });

  app.controller('createBill', function ($scope, $modal, $log) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'createBill.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      // resolve: {
      //   items: function () {
      //   }
      // }
    });

   modalInstance.result.then(function (selectedItem) {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date() + "create");
    });
  };
  });

  app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
    $scope.ok = function () {
      $modalInstance.close();
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

 app.controller('addFriend', function ($scope, $modal, $log) {

  $scope.user = {name: ""}

  $scope.open = function () {

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
      $scope.user.name = user.name;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('AddFriendModalInstanceCtrl', function ($scope, $modalInstance, user) {
  $scope.user = user;
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

})();

