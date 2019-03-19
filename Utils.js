(function(App){

	// Delegate class to use for event listeners.
	var Utils = (function(){

		// constructor
		function Utils(){			
		}

		Utils.prototype.marketsList = function(){
			return MarketList;
		}

		return Utils;

	}());

	App.Utils = Utils;		

})(App || (App = {}));

App.Utils = new App.Utils();