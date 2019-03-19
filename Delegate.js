(function(App){

	// Delegate class to use for event listeners.
	var Delegate = (function(){

		// constructor
		function Delegate(listener, scope){
			return function(e) { 
				listener.apply(null, [arguments, scope]);	
			}
		}

		return Delegate;

	}());

	App.Delegate = Delegate;		

})(App || (App = {}));