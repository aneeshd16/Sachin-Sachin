function OnConfig($stateProvider, $locationProvider, $urlRouterProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $stateProvider
  .state('Home', {  
    url: '/',
    controller: 'HomeCtrl as home',
    templateUrl: 'home.html',
    title: 'Home'
  })
  .state('Result', {
    url: '/result/:choice',
    controller: 'ResultCtrl as result',
    templateUrl: 'result.html',
    title: 'Result'
  });

  $urlRouterProvider.otherwise('/');

}

export default OnConfig;
