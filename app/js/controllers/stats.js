function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function StatsCtrl($firebaseObject, AppSettings, $filter) {
  'ngInject';
  // ViewModel
  const vm = this;
  var ODIqueryCache = {};
  /*Update the batting averages chart*/
  vm.updateChart = function() {
    vm.data = [];
    vm.data.push([]);
    vm.labels = [];
    if (vm.selectedCountry in ODIqueryCache) {
      //load from cache
      console.log('cache load');
      for(var prop in ODIqueryCache[vm.selectedCountry]) {
        if (ODIqueryCache[vm.selectedCountry].hasOwnProperty(prop)) {
          vm[prop] = ODIqueryCache[vm.selectedCountry][prop];
        }
      }
    } else {
      var winningQuery;
      if (vm.selectedCountry === 'The World') {
        var winningQuery = $filter('filter')(AppSettings.sachinODIData, {
          match_result: 'won'
        });
      } else {
        var winningQuery = $filter('filter')(AppSettings.sachinODIData, {
          match_result: 'won',
          opposition: vm.selectedCountry
        });
      }

      var winningGrounds = {};

      var clean = function(value) {
        return parseInt(value);
      }
      var curr;
      var highest = -1;
      var highestGround;
      for (curr in winningQuery) {
        if (clean(winningQuery[curr].batting_score) >= 0) {
          if (!(winningQuery[curr].ground in winningGrounds)) {
            winningGrounds[winningQuery[curr].ground] = {};
            winningGrounds[winningQuery[curr].ground]['average'] = clean(winningQuery[curr].batting_score);
            winningGrounds[winningQuery[curr].ground]['matches'] = 1;
          } else {
            winningGrounds[winningQuery[curr].ground]['average'] = ((winningGrounds[winningQuery[curr].ground]['average'] * winningGrounds[winningQuery[curr].ground]['matches']) + clean(winningQuery[curr].batting_score)) / (++winningGrounds[winningQuery[curr].ground]['matches']);
          }
          if (highest < clean(winningQuery[curr].batting_score)) {
            highest = clean(winningQuery[curr].batting_score);
            highestGround = winningQuery[curr].ground;
          }
        }
      }

      vm.highest = highest;
      vm.highestGround = highestGround;
      var labels = [];
      var totalAverage = 0;

      for (var ground in winningGrounds) {
        if (winningGrounds.hasOwnProperty(ground)) {
          vm.data[0].push(winningGrounds[ground].average);
          totalAverage += winningGrounds[ground].average;
          if (vm.selectedCountry === 'The World') {
            labels.push('');
          } else {
            labels.push(ground);
          }
        }
      }

      vm.totalAverage = totalAverage / labels.length;
      vm.labels = labels;
      var losingQuery;
      if (vm.selectedCountry === 'The World') {
        var losingQuery = $filter('filter')(AppSettings.sachinODIData, function(element) {
          if ((element.batting_score >= 50))
            return true;
        });
      } else {
        var losingQuery = $filter('filter')(AppSettings.sachinODIData, function(element) {
          if ((element.batting_score >= 50) && (element.opposition === vm.selectedCountry))
            return true;
        });
      }
      vm.pieLabels = ['WON', 'DID NOT WIN'];
      vm.pieData = [];
      var winCount = 0,
        loseCount = 0;
      losingQuery.reduce(function(prev, curr) {
        if (curr.match_result === 'won')
          winCount++;
        else
          loseCount++;
      });

      vm.pieData = [winCount, loseCount];

      vm.json = losingQuery;

      //add data to cache
      ODIqueryCache[vm.selectedCountry] = {};
      ODIqueryCache[vm.selectedCountry].highest = vm.highest;
      ODIqueryCache[vm.selectedCountry].highestGround = vm.highestGround;
      ODIqueryCache[vm.selectedCountry].data = vm.data;
      ODIqueryCache[vm.selectedCountry].labels = vm.labels;
      ODIqueryCache[vm.selectedCountry].totalAverage = vm.totalAverage;
      ODIqueryCache[vm.selectedCountry].pieData = vm.pieData;
      ODIqueryCache[vm.selectedCountry].pieLabels = vm.pieLabels;
    }
  }



  vm.countries = [];
  AppSettings.sachinODIData.sort(function(a, b) {
    return a.ground.localeCompare(b.ground);
  });
  AppSettings.sachinODIData.reduce(function(prev, curr) {
    vm.countries.push(curr.opposition);
  });
  vm.countries = vm.countries.filter(onlyUnique).sort();
  vm.countries.unshift('The World');
  vm.selectedCountry = vm.countries[0];
  vm.data = [];
  vm.data.push([]);
  vm.labels = [];
  vm.pieData = [];
  vm.pieLabels = [];
  vm.totalAverage = 0;
  vm.selectedFormat = 'ODIs'
  vm.updateChart();
  //vm.updatePie();

}

export default {
  name: 'StatsCtrl',
  fn: StatsCtrl
};
