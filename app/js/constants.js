var fs = require('fs');

var odis = JSON.parse(fs.readFileSync('sachinODI.json', 'utf8'));
var tests = JSON.parse(fs.readFileSync('sachinTest.json', 'utf8'));
var quotes = JSON.parse(fs.readFileSync('quotes.json', 'utf8'));
const AppSettings = {
  appTitle: 'Sachin Sachin!',
  apiUrl: '/api/v1',
  firebaseUrl: 'https://shining-heat-3130.firebaseio.com/',
  sachinODIData: odis,
  sachinTestData: tests,
  goodODIScore: 50,
  goodTestScore: 50,
  quotes: quotes
};

export default AppSettings;
