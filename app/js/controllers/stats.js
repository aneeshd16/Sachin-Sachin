function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function StatsCtrl($firebaseObject, AppSettings, $filter) {
  'ngInject';
  // ViewModel
  const vm = this;
  var queryCache = {};
  queryCache['ODIs'] = {};
  queryCache['Tests'] = {};
  vm.showStats = true;
  /*Update the batting averages chart*/
  vm.updateChart = function() {
    var searchSpace;
    vm.showStats = true;
    if (vm.selectedFormat === 'Tests') {
      if (vm.testCountries.indexOf(vm.selectedCountry) == -1) {
        vm.showStats = false;
        return;
      }
    }

    vm.goodScore = (vm.selectedFormat === 'ODIs' ? AppSettings.goodODIScore : AppSettings.goodTestScore);
    if (vm.selectedFormat === 'ODIs') {
      searchSpace = AppSettings.sachinODIData;
    } else {
      searchSpace = AppSettings.sachinTestData;
    }
    vm.data = [];
    vm.data.push([]);
    vm.labels = [];

    if (vm.selectedCountry in queryCache[vm.selectedFormat]) {
      //load from cache
      for (var prop in queryCache[vm.selectedFormat][vm.selectedCountry]) {
        if (queryCache[vm.selectedFormat][vm.selectedCountry].hasOwnProperty(prop)) {
          vm[prop] = queryCache[vm.selectedFormat][vm.selectedCountry][prop];
        }
      }
    } else {
      var winningQuery;
      if (vm.selectedCountry === 'The World') {
        var winningQuery = $filter('filter')(searchSpace, {
          match_result: 'won'
        });
      } else {
        var winningQuery = $filter('filter')(searchSpace, {
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
            winningGrounds[winningQuery[curr].ground]['average'] = ((winningGrounds[winningQuery[curr].ground]['average'] * winningGrounds[winningQuery[curr].ground]['matches']) + clean(winningQuery[curr].batting_score))
            if (winningQuery[curr].batting_score[winningQuery[curr].batting_score.length - 1] != '*') {
              (++winningGrounds[winningQuery[curr].ground]['matches']);
            }
            winningGrounds[winningQuery[curr].ground]['average'] /= winningGrounds[winningQuery[curr].ground]['matches'];
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

      var divider = labels.length;
      if (vm.selectedFormat === 'Tests')
        divider *= 2;
      vm.totalAverage = totalAverage / divider;
      vm.labels = labels;

      var losingQuery;

      if (vm.selectedCountry === 'The World') {
        losingQuery = $filter('filter')(searchSpace, function(element) {
          if ((element.batting_score >= vm.goodScore))
            return true;
        });
      } else {
        losingQuery = $filter('filter')(searchSpace, function(element) {
          if ((element.batting_score >= vm.goodScore) && (element.opposition === vm.selectedCountry)){
            return true;
          }
        });
      }
      if (losingQuery.length <= 1) {
        console.log("dgfbh");
        vm.pieData = [];
        vm.pieLabels = [];
        vm.showPie = false;
        return null;
      }
      else {
        vm.showPie = true;
        vm.pieLabels = ['WON', 'LOST'];
        vm.pieData = [];
        var winCount = 0,
          loseCount = 0;
        losingQuery.reduce(function(prev, curr) {
          if (curr.match_result === 'won')
            winCount++;
          else if (curr.match_result === 'lost')
            loseCount++;
        });

        vm.pieData = [winCount, loseCount];
      }
      

      vm.json = winningQuery;

      //add data to cache
      queryCache[vm.selectedFormat][vm.selectedCountry] = {};
      queryCache[vm.selectedFormat][vm.selectedCountry].highest = vm.highest;
      queryCache[vm.selectedFormat][vm.selectedCountry].highestGround = vm.highestGround;
      queryCache[vm.selectedFormat][vm.selectedCountry].data = vm.data;
      queryCache[vm.selectedFormat][vm.selectedCountry].labels = vm.labels;
      queryCache[vm.selectedFormat][vm.selectedCountry].totalAverage = vm.totalAverage;
      queryCache[vm.selectedFormat][vm.selectedCountry].pieData = vm.pieData;
      queryCache[vm.selectedFormat][vm.selectedCountry].pieLabels = vm.pieLabels;
    }

  }


  vm.showPie = true;
  vm.countries = [];
  AppSettings.sachinODIData.sort(function(a, b) {
    return a.ground.localeCompare(b.ground);
  });
  AppSettings.sachinTestData.sort(function(a, b) {
    return a.ground.localeCompare(b.ground);
  });
  AppSettings.sachinODIData.reduce(function(prev, curr) {
    vm.countries.push(curr.opposition);
  });
  vm.testCountries = [];
  AppSettings.sachinTestData.reduce(function(prev, curr) {
    vm.testCountries.push(curr.opposition);
  });
  vm.testCountries = vm.testCountries.filter(onlyUnique).sort();
  vm.countries = vm.countries.filter(onlyUnique).sort();
  vm.countries.unshift('The World');
  vm.testCountries.unshift('The World');
  vm.selectedCountry = vm.countries[0];
  vm.data = [];
  vm.data.push([]);
  vm.labels = [];
  vm.pieData = [];
  vm.pieLabels = [];
  vm.totalAverage = 0;
  vm.selectedFormat = 'ODIs'
  vm.updateChart();
  //vm.json = vm.testCountries;
  //vm.updatePie();

}

export default {
  name: 'StatsCtrl',
  fn: StatsCtrl
};
