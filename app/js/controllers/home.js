function HomeCtrl($firebaseObject, $state, AppSettings) {
  'ngInject';
  // ViewModel
  const vm = this;

  vm.title = 'Sachin Sachin!';
  vm.number = 1234;
  var ref = new Firebase(AppSettings.firebaseUrl);
  // download the data into a local object
  vm.data = $firebaseObject(ref);
  var yesCount = (ref.child('yes'));
  var noCount = (ref.child('no'));

  var quotes = AppSettings.quotes;
  var i = Math.floor(Math.random() * (quotes.length));
  vm.quote = quotes[i].quote;
  vm.author = quotes[i].author;

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
