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
    $scope.bill = {title: "",
      type: "",
      splitters:"",
      amount:"",
      comments:"",
     }


  $scope.open = function (size) {

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
      $log.info('Modal dismissed at: ' + new Date() + "create");
    });
  };
  });

  app.controller('ModalInstanceCtrl', function ($scope, $modalInstance,bill) {
    $scope.bill = bill;
    $scope.bill = null;
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
      //$scope.user = {}; //reset form
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('AddFriendModalInstanceCtrl', function ($scope, $modalInstance, user) {
  $scope.user = user;
  $scope.user = null;
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('payBill', function ($scope, $modal, $log){
  $scope.pay = {status: "", method: ""}

  $scope.open = function () {

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
  $scope.pay = null;
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
//-----------------------------------------------------------------------------------------------
app.controller('ForgotLogin', function ($scope, $modal, $log){
  $scope.flogin = {email: ""}

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'ForgotLogin.html',
      controller: 'ForgotLoginModalInstanceCtrl',
      resolve: {
        flogin: function () {
          return $scope.flogin;
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

app.controller('ForgotLoginModalInstanceCtrl', function ($scope, $modalInstance, flogin) {
  $scope.flogin = flogin;
  $scope.flogin = null;
  $scope.ok = function () {
    alert("An email has been sent to the provided email address");
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
//-----------------------------------------------------------------------------------------------

//Display value as currency - kind of buggy
// app.directive('realTimeCurrency', function ($filter, $locale) {
//     var decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
//     var toNumberRegex = new RegExp('[^0-9\\' + decimalSep + ']', 'g');
//     var trailingZerosRegex = new RegExp('\\' + decimalSep + '0+$');
//     var filterFunc = function (value) {
//         return $filter('currency')(value);
//     };

//     function getCaretPosition(input){
//         if (!input) return 0;
//         if (input.selectionStart !== undefined) {
//             return input.selectionStart;
//         } else if (document.selection) {
//             // Curse you IE
//             input.focus();
//             var selection = document.selection.createRange();
//             selection.moveStart('character', input.value ? -input.value.length : 0);
//             return selection.text.length;
//         }
//         return 0;
//     }

//     function setCaretPosition(input, pos){
//         if (!input) return 0;
//         if (input.offsetWidth === 0 || input.offsetHeight === 0) {
//             return; // Input's hidden
//         }
//         if (input.setSelectionRange) {
//             input.focus();
//             input.setSelectionRange(pos, pos);
//         }
//         else if (input.createTextRange) {
//             // Curse you IE
//             var range = input.createTextRange();
//             range.collapse(true);
//             range.moveEnd('character', pos);
//             range.moveStart('character', pos);
//             range.select();
//         }
//     }
    
//     function toNumber(currencyStr) {
//         return parseFloat(currencyStr.replace(toNumberRegex, ''), 10);
//     }

//     return {
//         restrict: 'A',
//         require: 'ngModel',
//         link: function postLink(scope, elem, attrs, modelCtrl) {    
//             modelCtrl.$formatters.push(filterFunc);
//             modelCtrl.$parsers.push(function (newViewValue) {
//                 var oldModelValue = modelCtrl.$modelValue;
//                 var newModelValue = toNumber(newViewValue);
//                 modelCtrl.$viewValue = filterFunc(newModelValue);
//                 var pos = getCaretPosition(elem[0]);
//                 elem.val(modelCtrl.$viewValue);
//                 var newPos = pos + modelCtrl.$viewValue.length -
//                                    newViewValue.length;
//                 if ((oldModelValue === undefined) || isNaN(oldModelValue)) {
//                     newPos -= 3;
//                 }
//                 setCaretPosition(elem[0], newPos);
//                 return newModelValue;
//             });
//         }
//     };
// });

})();

