angular.module('BillsModalCtrl', []).controller('BillsModalController', function($scope, $modalInstance, bill, $http, $location, friends) {
  $scope.includeSelf = false;

  $scope.includeSelfToggle = function(){
        if ($scope.includeSelf === false) {
            console.log("including self");
            $scope.includeSelf = true;
            return $scope.includeSelf;
        } else {
            console.log("not including self");
            $scope.includeSelf = false;
            return $scope.includeSelf;
        }
    }

    var activeButton = 1;

    $scope.setButton = function(newButtonValue){
        activeButton = newButtonValue;
    };

    $scope.isSetButton = function(buttonName){
      return activeButton === buttonName;
    };

    $scope.bill = bill;

    $scope.checkPaid = function() {
        for (var user in $scope.bill.group) {
            if ($scope.bill.group[user].user._id == $scope.user._id && $scope.bill.group[user].paid == true){
                return true;
            } else {
                return false
            }
        }
    };

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
