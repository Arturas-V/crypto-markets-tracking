(function(App){

	var ToolTip = App.ToolTip;

	// Delegate class to use for event listeners.
	var AutoComplete = (function(){

		// constructor
		function AutoComplete(){
			this.toolTip = null;
		}

		AutoComplete.prototype.show = function() {
			var _this = this;
			var newList = this.marketList.filter(function(market){				
				return market.startsWith(_this.target.value.toUpperCase());
			});

			if(newList.length > 0) {
				var htmlList = this.listToHTML(newList);
				var options = {"class": "market-autocomplete-tooltip"}
				
				if(!this.toolTip) {
					this.toolTip = new ToolTip(options);
					this.toolTip.market = this.market;					
					this.market.appendChild(_this.toolTip.render());
				}

				this.toolTip.show(htmlList);
			}

			// hide tooltip if input empty or no matching market
			if(this.target.value == "" || newList.length == 0) {
				this.toolTip.hide();
			}
			
		}

		AutoComplete.prototype.hide = function() {
			if(this.toolTip) {
				this.toolTip.hide();
			}
		}

		AutoComplete.prototype.listToHTML = function(newList) {
			var content = "";

			for (var i = 0; i < newList.length; i++){
				content += "<div>" + newList[i] + "</div>";
			}

			return content;
		}

		AutoComplete.prototype.dispose = function() {
			if(this.toolTip) {
				this.toolTip.dispose();
				this.toolTip = null;
			}
		}

		return AutoComplete;

	}());

	App.AutoComplete = AutoComplete;		

})(App || (App = {}));