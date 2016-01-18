var fs = require('fs');

var obj = JSON.parse(fs.readFileSync('sachin.json', 'utf8'));
const AppSettings = {
  appTitle: 'Sachin Sachin!',
  apiUrl: '/api/v1',
  sachinData: obj
};

export default AppSettings;
