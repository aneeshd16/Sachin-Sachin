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
    var winningQuery = $filter('filter')(AppSettings.sachinData, {
      match_result: 'won',
      opposition: vm.selectedCountry
    });

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
        labels.push(ground);
      }
    }

    vm.totalAverage = totalAverage / labels.length;
    vm.labels = labels;

    var losingQuery = $filter('filter')(AppSettings.sachinData, function(element) {
      if((element.batting_score >= 50) && (element.opposition === vm.selectedCountry))
        return true;
    });

    vm.pieLabels = ['WON','DID NOT WIN'];
    vm.pieData = [];
    var winCount = 0, loseCount = 0;
    losingQuery.reduce(function(prev, curr){
      if(curr.match_result === 'won')
        winCount++;
      else
        loseCount++;
    });

    vm.pieData = [winCount, loseCount];

    vm.json = losingQuery;
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
  vm.pieData = [];
  vm.pieLabels = [];
  vm.totalAverage = 0;
  vm.updateChart();
  //vm.updatePie();

}

export default {
  name: 'StatsCtrl',
  fn: StatsCtrl
};
