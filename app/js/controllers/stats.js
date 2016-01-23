function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function StatsCtrl($firebaseObject, AppSettings, $filter) {
  'ngInject';
  //Init vars
  const vm = this;

  //Used for caching queries
  var queryCache = {};
  queryCache['ODIs'] = {};
  queryCache['Tests'] = {};

  vm.data = [];
  vm.data.push([]);
  vm.labels = [];
  vm.pieData = [];
  vm.pieLabels = [];
  vm.totalAverage = 0;
  vm.selectedFormat = 'ODIs'
  
  vm.showStats = true;
  vm.showPie = true;
  /*Update the batting averages chart*/
  vm.updateChart = function() {
    var searchSpace;
    vm.showStats = true;
    vm.data = [];
    vm.data.push([]);
    vm.labels = [];

    //Hide Stats if select country does not play tests
    if (vm.selectedFormat === 'Tests') {
      if (vm.testCountries.indexOf(vm.selectedCountry) == -1) {
        vm.showStats = false;
        return;
      }
    }

    //select data store from selected format
    if (vm.selectedFormat === 'ODIs') {
      searchSpace = AppSettings.sachinODIData;
      vm.goodScore = AppSettings.goodODIScore;
    } else {
      searchSpace = AppSettings.sachinTestData;
      vm.goodScore = AppSettings.goodTestScore;
    }
    
    //check cache if query has been done previously
    if (vm.selectedCountry in queryCache[vm.selectedFormat]) {
      //load from cache
      for (var prop in queryCache[vm.selectedFormat][vm.selectedCountry]) {
        if (queryCache[vm.selectedFormat][vm.selectedCountry].hasOwnProperty(prop)) {
          vm[prop] = queryCache[vm.selectedFormat][vm.selectedCountry][prop];
        }
      }
    } else {
      //make new query
      var matchesIndiaWon;
      if (vm.selectedCountry === 'The World') {
        var matchesIndiaWon = $filter('filter')(searchSpace, {
          match_result: 'won'
        });
      } else {
        var matchesIndiaWon = $filter('filter')(searchSpace, {
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
      for (curr in matchesIndiaWon) {
        var score = matchesIndiaWon[curr].batting_score;
        var ground = matchesIndiaWon[curr].ground;
        if (clean(score) >= 0) {
          if (!(ground in winningGrounds)) {
            winningGrounds[ground] = {};
            winningGrounds[ground]['average'] = clean(score);
            winningGrounds[ground]['matches'] = 1;
          } else {
            //calculate cumulative average
            winningGrounds[ground]['average'] = ((winningGrounds[ground]['average'] * winningGrounds[ground]['matches']) + clean(score))
            if (score[score.length - 1] != '*') {
              //if not out, do not increment denominator
              (++winningGrounds[ground]['matches']);
            }
            winningGrounds[ground]['average'] /= winningGrounds[ground]['matches'];
          }
          if (highest < clean(score)) {
            highest = clean(score);
            highestGround = ground;
          }
        }
      }

      vm.highest = highest;
      vm.highestGround = highestGround;
      var labels = [];
      var totalAverage = 0;

      //Populate bar chart data
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

      //Calculate total average and highest
      var divider = labels.length;
      if (vm.selectedFormat === 'Tests')
        divider *= 2;
      vm.totalAverage = totalAverage / divider;
      vm.labels = labels;

      var matchesSachinScoredGood;

      if (vm.selectedCountry === 'The World') {
        matchesSachinScoredGood = $filter('filter')(searchSpace, function(element) {
          if ((element.batting_score >= vm.goodScore))
            return true;
        });
      } else {
        matchesSachinScoredGood = $filter('filter')(searchSpace, function(element) {
          if ((element.batting_score >= vm.goodScore) && (element.opposition === vm.selectedCountry)) {
            return true;
          }
        });
      }
      if (matchesSachinScoredGood.length <= 1) {
        console.log("dgfbh");
        vm.pieData = [];
        vm.pieLabels = [];
        vm.showPie = false;
        return null;
      } else {
        vm.showPie = true;
        vm.pieLabels = ['WON', 'LOST'];
        vm.pieData = [];
        var winCount = 0,
          loseCount = 0;
        matchesSachinScoredGood.reduce(function(prev, curr) {
          if (curr.match_result === 'won')
            winCount++;
          else if (curr.match_result === 'lost')
            loseCount++;
        });

        vm.pieData = [winCount, loseCount];
      }

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

  //Sort data by ground name
  AppSettings.sachinODIData.sort(function(a, b) {
    return a.ground.localeCompare(b.ground);
  });
  AppSettings.sachinTestData.sort(function(a, b) {
    return a.ground.localeCompare(b.ground);
  });

  //Get a list of all countries
  vm.testCountries = [];
  vm.countries = [];
  AppSettings.sachinODIData.reduce(function(prev, curr) {
    vm.countries.push(curr.opposition);
  });
  
  AppSettings.sachinTestData.reduce(function(prev, curr) {
    vm.testCountries.push(curr.opposition);
  });
  vm.testCountries = vm.testCountries.filter(onlyUnique).sort();
  vm.countries = vm.countries.filter(onlyUnique).sort();
  vm.countries.unshift('The World');
  vm.testCountries.unshift('The World');
  vm.selectedCountry = vm.countries[0];
  vm.updateChart();
}

export default {
  name: 'StatsCtrl',
  fn: StatsCtrl
};
