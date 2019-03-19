(function(App){

	var Delegate = App.Delegate;

	// ToolTip class for tooltip Component creation.
	var ToolTip = (function(_super){

		__extend(ToolTip, App.DomElement);

		// constructor
		function ToolTip(options){
			var _this = this;

			//delegates
			this.selectMarket_delegate = new Delegate(_this.selectMarketHandler, _this);
			this.options = options

			this.createBox();
		}

		ToolTip.prototype.render = function () {
			return this.elem;
		}

		ToolTip.prototype.createBox = function() {
			var _this = this;

			this.elem = document.createElement("div");
			this.elem.className = this.options.class;
			this.elem.addEventListener("click", _this.selectMarket_delegate);
		}

		ToolTip.prototype.selectMarketHandler = function(event, scope) {
			this.elem.dispatch(App.EventType.TOOLTIP_CLICK);
			scope.market.value = event[0].target.innerHTML;			
		}

		ToolTip.prototype.hide = function() {
			var _this = this;

			this.hideElement(_this.elem);
		}

		ToolTip.prototype.show = function(content) {
			var _this = this;

			this.elem.innerHTML = content;
			this.showElement(_this.elem);
		}

		ToolTip.prototype.dispose = function() {
			var _this = this;
			
			this.elem.removeEventListener("click", _this.selectMarket_delegate);			
		}

		return ToolTip;

	}());

	App.ToolTip = ToolTip;		

})(App || (App = {}));