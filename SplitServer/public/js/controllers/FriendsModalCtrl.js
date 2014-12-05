angular.module('FriendsModalCtrl', []).controller('FriendsModalController', function($scope, $modalInstance, $http, $location) {
    $scope.message = null;
    
    $http.get('/getUsers')
        .success(function(users) { 
            $scope.users = users;
        });
    
    $scope.searchFilter = function (obj) {
        var input = $scope.search.input.$viewValue;
        var regex = new RegExp(String(input).replace(/\s/g,""), 'i');
        return !input ||
                regex.test(obj.firstName + obj.lastName) || 
                regex.test(obj.username);
    }

    $scope.acceptFriendButton = function(friend) {
        console.log("Accept");
        $scope.acceptFriend(friend);
        $http.get('/user').success(function(user) {
            $scope.user = user;
        });

        //$http.put('/acceptFriend', {friend: friend})
        //    .success(function(data) {
        //        $scope.user = data.user;
        //        $scope.message = data.message
        //    })
        //    .error(function(message) {
        //        $scope.message = message;
        //    });
    }

    $scope.addFriend = function(friend) {
        console.log(friend);
        if (!friend._id) {
            $scope.message = { text: 'Cannot find User ' + friend, 
                               type: 'warning' }
            return;
        }
        $http.post('/addFriend', { friend: friend })
            .success(function(data) {
                $scope.user = data.user;
                $scope.setMessage(data.message);
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
