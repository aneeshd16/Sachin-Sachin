function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function StatsCtrl($firebaseObject, AppSettings, $filter) {
  'ngInject';
  // ViewModel
  const vm = this;

  /*Update the batting averages chart*/
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
    var curr;
    var highest = -1;
    var highestGround;
    for (curr in query) {
      if (clean(query[curr].batting_score) >= 0) {
        if (!(query[curr].ground in grounds)) {
          grounds[query[curr].ground] = {};
          grounds[query[curr].ground]['average'] = clean(query[curr].batting_score);
          grounds[query[curr].ground]['matches'] = 1;
        } else {
          grounds[query[curr].ground]['average'] = ((grounds[query[curr].ground]['average'] * grounds[query[curr].ground]['matches']) + clean(query[curr].batting_score)) / (++grounds[query[curr].ground]['matches']);
        }
        if (highest < clean(query[curr].batting_score)) {
          highest = clean(query[curr].batting_score);
          highestGround = query[curr].ground;
        }
      }
    }

    vm.highest = highest;
    vm.highestGround = highestGround;
    var labels = [];
    var totalAverage = 0;

    for (var ground in grounds) {
      if (grounds.hasOwnProperty(ground)) {
        vm.data[0].push(grounds[ground].average);
        totalAverage += grounds[ground].average;
        labels.push(ground);
      }
    }

    vm.totalAverage = totalAverage / labels.length;
    vm.labels = labels;

    vm.json = grounds;
  }

  vm.countries = [];
  AppSettings.sachinData.sort(function(a, b) {
    return a.ground.localeCompare(b.ground);
  });
  AppSettings.sachinData.reduce(function(prev, curr) {
    vm.countries.push(curr.opposition);
  });
  vm.countries = vm.countries.filter(onlyUnique).sort();
  vm.selectedCountry = vm.countries[0];
  vm.data = [];
  vm.data.push([]);
  vm.labels = [];
  vm.totalAverage = 0;
  vm.updateChart();


}

export default {
  name: 'StatsCtrl',
  fn: StatsCtrl
};
