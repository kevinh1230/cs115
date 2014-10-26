angular.module('split', ['ngResource', 'ngRoute']);

angular.module('split').controller('userCtrl', function($scope, $http) {
   $http.get('/user').success(function(user) {
         $scope.user = user;
      });

   $scope.acceptFriend = function(friend) {
      console.log(friend);
      $http.put('/acceptFriend', {friend: friend})
           .success(function(user) {
              $scope.user = user;
           });
   }

   $scope.addFriend = function(friend) {
      $http.post('/addFriend2', { friend: friend })
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
});
