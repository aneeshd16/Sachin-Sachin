import angular from 'angular';

// angular modules
import constants from './constants';
import onConfig  from './on_config';
import onRun     from './on_run';
import 'angular-ui-router';
import 'firebase';
import 'angularfire';
import 'angular-chart.js';
import 'angular-loading-bar';
import './templates';
import './filters';
import './controllers';
import './services';
import './directives';
import './components';

// create and bootstrap application
const requires = [
  'ui.router',
  'templates',
  'app.filters',
  'app.controllers',
  'app.services',
  'app.directives',
  'app.components',
  'firebase',
  'chart.js',
  'angular-loading-bar'
];

// mount on window for testing
window.app = angular.module('app', requires);

angular.module('app').constant('AppSettings', constants);

angular.module('app').config(onConfig);

angular.module('app').run(onRun);

angular.bootstrap(document, ['app'], {
  strictDi: true
});
