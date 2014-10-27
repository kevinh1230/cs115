var Split = angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'LoginCtrl', 'SignupCtrl', 'ProfileCtrl','NerdCtrl', 'NerdService', 'GeekCtrl', 'GeekService']);

Split.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

