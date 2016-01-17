function ResultCtrl($firebaseObject, $stateParams) {
  'ngInject';
  // ViewModel
  const vm = this;
  vm.choice = $stateParams.choice;
  vm.title = 'Sachin Sachin!';
  vm.number = 1234;
  var ref = new Firebase("https://shining-heat-3130.firebaseio.com");
  // download the data into a local object
  vm.allData = $firebaseObject(ref);
  vm.allData.$loaded()
    .then(function(rdata) {
      vm.labels = ["People who voted YES", "People who voted No"];
      vm.yesPercentage = (rdata.yes/(rdata.yes+rdata.no))*100;
      vm.noPercentage = (rdata.no/(rdata.yes+rdata.no))*100;
      vm.data = [vm.yesPercentage, vm.noPercentage];
      vm.chartColours = ['#46BFBD','#F7464A'];
      vm.chartOptions = {
        tooltipTemplate: "<%if (label){%><%=label%><%}%>",
      }
    })
    .catch(function(error) {
      console.error("Error:", error);
    });
  
  
  console.log(vm.m);
}

export default {
  name: 'ResultCtrl',
  fn: ResultCtrl
};
