angular.module('zeus', [
  'zeus.landing',
  'zeus.results',
  'zeus.details',
  'zeus.services',
  'zeus.user',
  'zeus.account',
  'zeus.reviews',
  'auth0.lock',
  'angular-jwt',
  'ngRoute'
])
.controller('zeusController', function($scope, $location, authService, $http, User) {
  $scope.searchQuery = '';
  $scope.search = function(search) {
    if (search.length < 1) {
      return;
    }
    $location.path('/results/' + search + '/1');
    $scope.searchQuery = '';
  };

  $scope.login = authService.login;
  $scope.logout = function() {
    authService.logout();
  };



    //Gets user profile when logged in.
  authService.getProfileDeferred().then(function (profile) {
    console.log(profile);
    $scope.profile = profile;
    if (profile) {
      User.checkUser(profile);
    }
  });
})

.config(function($routeProvider, $locationProvider, lockProvider, jwtOptionsProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/landing/landing.html',
      controller: 'LandingController',
      controllerAs: 'LandingVm'
    })
    .when('/results/:search/:page', {
      templateUrl: 'app/results/results.html',
      controller: 'ResultsController',
      controllerAs: 'ResultsVm'
    })
    .when('/details/:type/:id', {
      templateUrl: 'app/details/details.html',
      controller: 'DetailsController'
    })
    .when('/user', {
      templateUrl: 'app/user/user.html',
      controller: 'UserController'
    })
    .when('/user/:username', {
      templateUrl: 'app/user/user.html',
      controller: 'UserController'
    })
    .when('/:type/:id', {
      templateUrl: 'app/details/details.html',
      controller: 'DetailsController'
    })
    .when('/account', {
      templateUrl: 'app/account/account.html',
      controller: 'AccountController'
    })
    .when('/review/:id', {
      templateUrl: 'app/reviews/reviews.html',
      controller: 'ReviewsController'
    })
    .otherwise('/');

  //Auth 0 account info
  lockProvider.init({
    clientID: 'GaWAS7TybB6Fqwa9uBw2SDVMPRGSAVDK',
    domain: 'hughes89.auth0.com'
  });
  // Sets HTML5 Mode to true, removes # from url
  //$locationProvider.html5Mode(true);

  jwtOptionsProvider.config({
    tokenGetter: ['options', function (options) {
      if (options && options.url.substr(options.url.length - 5) === '.html') {
        return null;
      }
      return localStorage.getItem('id_token');
    }],
    whiteListedDomains: ['localhost:3000'],
    unauthenticatedRedirectPath: '/login'
  });
  //Attatches token to each HTTP call
  $httpProvider.interceptors.push('jwtInterceptor');
})

.run(function ($rootScope, authService, lock, authManager) {
  // Put the authService on $rootScope so its methods
  // can be accessed from the nav bar
  $rootScope.authService = authService;

  // Register the authentication listener that is
  // set up in auth.service.js
  authService.registerAuthenticationListener();

  // Use the authManager from angular-jwt to check for
  // the user's authentication state when the page is
  // refreshed and maintain authentication
  authManager.checkAuthOnRefresh();

  // Register synchronous hash parser
  lock.interceptHash();
});
