(function(App){
	var Delegate = App.Delegate;

	var Controller = (function(){

		function Controller(){
			var _this = this;

			// reference to elements, containers.
			this.marketsContainer = document.getElementById("markets");

			//delegates
			this.addMarket_delegate = new Delegate(_this.addMarket, _this);

			this.init();
		}

		/*
		 * Initiliase components, adds listeners.
		 */
		Controller.prototype.init = function() {
			var _this = this,
				addMarket = document.getElementById("add-market");

			addMarket.addEventListener("click", _this.addMarket_delegate);
		}

		/*
		 * Creates new market and append to markets container
		 */
		Controller.prototype.addMarket = function(event, scope){
			scope.marketsContainer.appendChild(new App.Market());
		}

		return Controller;

	}());

	App.Controller = Controller;

})(App || (App = {}));

App.Controller = new App.Controller();
App.MarketsTracking = new App.MarketsTracking();