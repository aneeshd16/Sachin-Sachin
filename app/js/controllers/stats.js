function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function StatsCtrl($firebaseObject, AppSettings, $filter) {
  'ngInject';
  // ViewModel
  const vm = this;
  //vm.data = AppSettings.sachinData;

  vm.updateChart = function() {
    vm.data = [];
    vm.data.push([]);
    vm.labels = [];
    var query = $filter('filter')(AppSettings.sachinData, {
      match_result: 'won',
      opposition: vm.selectedCountry
    });

    var grounds = {};

    var clean = function(value) {
      return parseInt(value);
    }

    query.reduce(function(prev, curr) {
      if (!(curr.ground in grounds)) {
        grounds[curr.ground] = {};
        grounds[curr.ground]['average'] = clean(curr.batting_score);
        grounds[curr.ground]['matches'] = 1;
      } else {
        grounds[curr.ground]['average'] = ((grounds[curr.ground]['average'] * grounds[curr.ground]['matches']) + clean(curr.batting_score)) / (++grounds[curr.ground]['matches']);
      }
    });

    var labels = [];
    for (var ground in grounds) {
      if (grounds.hasOwnProperty(ground)) {
        vm.data[0].push(grounds[ground].average);
        labels.push(ground);
      }
    }

    vm.labels = labels.sort();


    vm.json = vm.labels;
  }

  vm.countries = [];
  AppSettings.sachinData.reduce(function(prev, curr) {
    vm.countries.push(curr.opposition);
  });
  vm.countries = vm.countries.filter(onlyUnique).sort();
  vm.selectedCountry = vm.countries[0];
  vm.data = [];
  vm.data.push([]);
  vm.labels = [];
  vm.updateChart();


}

export default {
  name: 'StatsCtrl',
  fn: StatsCtrl
};
