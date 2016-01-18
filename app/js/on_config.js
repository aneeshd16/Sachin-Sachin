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
  })
  .state('Stats', {
    url: '/stats',
    controller: 'StatsCtrl as stats',
    templateUrl: 'stats.html',
    title: 'Stats'
  });

  $urlRouterProvider.otherwise('/');

}

export default OnConfig;
