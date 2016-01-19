var fs = require('fs');

var odis = JSON.parse(fs.readFileSync('sachinODI.json', 'utf8'));
var tests = JSON.parse(fs.readFileSync('sachinTest.json', 'utf8'));
const AppSettings = {
  appTitle: 'Sachin Sachin!',
  apiUrl: '/api/v1',
  sachinODIData: odis,
  sachinTestData: tests
};

export default AppSettings;
