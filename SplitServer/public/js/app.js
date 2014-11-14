var Split = angular.module('sampleApp', ['ngRoute', 'ui.bootstrap', 'appRoutes', 'MainCtrl', 'LoginCtrl', 'SignupCtrl', 'ProfileCtrl', 'CreateBillCtrl', 'GeekService']);

Split.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

Split.run(['$rootScope', function($rootScope) {
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
		$rootScope.title = current.$$route.title || '404';
	});
}]);
