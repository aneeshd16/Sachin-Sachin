function HomeCtrl($firebaseObject, $state) {
  'ngInject';
  // ViewModel
  const vm = this;

  vm.title = 'Sachin Sachin!';
  vm.number = 1234;
  var ref = new Firebase("https://shining-heat-3130.firebaseio.com/");
  // download the data into a local object
  vm.data = $firebaseObject(ref);
  var yesCount = (ref.child('yes'));
  var noCount = (ref.child('no'));

  vm.btnClicked = function(param) {
    if (param === 1) {
      yesCount.transaction(function(current_value) {
        return (current_value || 0) + 1;
      },
      function(error) {
      	if(error)
      		console.log(error);
      	else {
      		$state.go('Result',{choice:'yes'});
      	}

      });
    } else {
      //clicked no
      noCount.transaction(function(current_value) {
        return (current_value || 0) + 1;
      },
      function(error) {
      	if(error)
      		console.log(error);
      	else {
      		$state.go('Result',{choice:'no'});
      	}

      });
    }
  }
}

export default {
  name: 'HomeCtrl',
  fn: HomeCtrl
};
