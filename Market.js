(function(App){
	var MarketsTracking = App.MarketsTracking;
	var Delegate = App.Delegate;
	var AutoComplete = App.AutoComplete;
	var DomElement = App.DomElement;

	var Market = (function(){

		__extend(Market, DomElement);

		var MARKET_LIST = App.Utils.marketsList();

		var BUTTON_TYPE_LOOKUP = {
			REMOVE_MARKET: 1,
			TRACK_MARKET: 2
		}

		// constructor
		function Market() {
			var _this = this;

			// market nodes references
			this.node = null;
			this.marketNode = null;
			this.priceNode = null;
			this.inputsWrapper = null;
			this.removeButton = null;
			this.trackButton = null;

			// tracking market line refernces
			this.trackingLine = null;
			this.trackMarketName = null;
			this.trackMarketPaidPrice = null;
			this.trackMarketPriceBTC = 0;
			this.trackMarketPriceUSD = 0;
			this.trackMarketNameValue = "";
			this.trackMarketPaidPriceValue = "";
			this.trackMarketPriceBTCValue = "";
			this.trackMarketPriceUSDValue = "";

			// general flags
			this.marketUnderTracking = false;

			// data lookups
			this.price = {"BTC":"","USD":""};
			this.marketData = {"name":"", "pricePaid":""};

			// delegates
			this.marketClick_delegate = new Delegate(_this.marketClickHandler, _this);
			this.enterMarketName_delegate = new Delegate(_this.enterMarketNameHandler, _this);
			this.leaveMarketName_delegate = new Delegate(_this.leaveMarketNamehandler, _this);

			// additional components
			this.autoComplete = null;

			this.createNode();			

			return this.node;
		}

		Market.prototype.createNode = function () {
			var _this = this;

			// market node
			this.node = document.createElement("div");		

			// inputs
			this.marketNode = document.createElement("input");
			this.priceNode = document.createElement("input");
			this.inputsWrapper = document.createElement("div");

			// create tracking nodes
			this.trackingLine = document.createElement("div");
			this.trackMarketName = document.createElement("span");
			this.trackMarketPaidPrice = document.createElement("span");
			this.trackMarketPriceBTC = document.createElement("span");
			this.trackMarketPriceUSD = document.createElement("span");

			// buttons
			this.removeButton = document.createElement("span");
			this.trackButton = document.createElement("span");
			
			// market input
			this.marketNode.className = "input";
			this.marketNode.placeholder = "market";
			this.marketNode.type = "text";
			this.marketNode.size = "4"
			this.marketNode.addEventListener("keyup", _this.enterMarketName_delegate);
			this.marketNode.addEventListener("blur", _this.leaveMarketName_delegate);

			// price input
			this.priceNode.className = "input";
			this.priceNode.placeholder = "paid";
			this.priceNode.type = "text";
			this.priceNode.size = "10"

			this.inputsWrapper.className = "inputs-wrapper";
			this.inputsWrapper.appendChild(_this.marketNode);
			this.inputsWrapper.appendChild(_this.priceNode);			

			// tracking line
			this.trackingLine.className = "tracking-line hidden";
			this.trackingLine.appendChild(_this.trackMarketName);
			this.trackingLine.appendChild(_this.trackMarketPaidPrice);
			this.trackingLine.appendChild(_this.trackMarketPriceBTC);
			this.trackingLine.appendChild(_this.trackMarketPriceUSD);			

			// remove button
			this.removeButton.className = "button";
			this.removeButton.innerHTML = "Del";
			this.removeButton.buttonType = BUTTON_TYPE_LOOKUP.REMOVE_MARKET;

			// track button
			this.trackButton.className = "button";
			this.trackButton.innerHTML = "Go";
			this.trackButton.buttonType = BUTTON_TYPE_LOOKUP.TRACK_MARKET;

			this.node.className = "market";			
			this.node.appendChild(_this.inputsWrapper);
			this.node.appendChild(_this.trackingLine);
			this.node.appendChild(_this.trackButton);
			this.node.appendChild(_this.removeButton);			
			this.node.addEventListener("click", _this.marketClick_delegate);
			var xx = 5;
			for (var i; i < 5000; i++){
				xx = 56;
			}
		}

		Market.prototype.marketClickHandler = function(event, scope){
			var type = event[0].target.buttonType;

			if (type == BUTTON_TYPE_LOOKUP.REMOVE_MARKET) {

				scope.removeMarket(event[0], scope);

			} else if (type === BUTTON_TYPE_LOOKUP.TRACK_MARKET){

				if (scope.marketUnderTracking) {

					scope.marketUnderTracking = false;
					scope.trackButton.innerHTML = "Go";

					// hide market creation line and show tracking line
					scope.showElement(scope.inputsWrapper);
					scope.hideElement(scope.trackingLine);

					// edit market if it is under tracking
					App.MarketsTracking.removeMarket(scope);					

					scope.hideElement(scope.trackingLine);
					scope.showElement(scope.node);

				} else {
					// start tracking market
					scope.validateAndStartTracking(event, scope);
				}				
			}						
		}	

		Market.prototype.enterMarketNameHandler = function(event, scope){
				
			if(!scope.autoComplete) {
				scope.autoComplete = new AutoComplete();				
			}

			scope.autoComplete.marketList = MARKET_LIST;
			scope.autoComplete.target = event[0].target;
			scope.autoComplete.market = scope.node;
			
			scope.autoComplete.show();
		}

		Market.prototype.leaveMarketNamehandler = function(event, scope){
			console.log(event);		
			if(scope.autoComplete) {
				// scope.autoComplete.hide();			
			}
		}

		Market.prototype.removeMarket = function (event, scope) {
			var parent = event.target.parentNode,
				sibling = parent.previousSibling;

				// remove market from tracking mechanics queue
				App.MarketsTracking.removeMarket(scope);			

				// remove event listeners
				if(scope.node){scope.node.removeEventListener("click", scope.marketClick_delegate);}
				if(scope.marketNode){scope.marketNode.removeEventListener("keyup", scope.enterMarketName_delegate);}
				if(scope.marketNode){scope.marketNode.removeEventListener("blur", scope.leaveMarketName_delegate);}
				
				// remove node
				if(sibling){
					parent.parentNode.removeChild(sibling.nextSibling);
				} else {
					parent.parentNode.removeChild(parent.parentNode.firstElementChild);
				}

				// clear up autocomplete
				if(scope.autoComplete) {
					scope.autoComplete.dispose();
					scope.autoComplete = null;			
				}

				// remove scope
				scope = null;
		}		

		Market.prototype.validateAndStartTracking = function (event, scope) {
			var marketName = scope.marketNode,
				paidPrice = scope.priceNode;

			// clear error styles if they exist
			scope.removeStyle(marketName, "error");
			scope.removeStyle(paidPrice, "error");	

			if(marketName.value == "" || paidPrice.value == ""){

				if(marketName.value == "") {
					scope.addStyle(marketName, "error");
				}

				if(paidPrice.value == "") {
					scope.addStyle(paidPrice, "error");
				}

				return;
			}

			this.marketData["name"] = marketName.value.toUpperCase();
			this.marketData["pricePaid"] = paidPrice.value.toUpperCase();

			App.MarketsTracking.addMarket(scope)
		}

		Market.prototype.updateTrackingView = function(){
			var _this = this;

			this.marketUnderTracking = true;
			this.trackButton.innerHTML = "Edit";

			// hide market creation line and show tracking line
			this.hideElement(_this.inputsWrapper);
			this.showElement(_this.trackingLine);

			// update node only if new data comes			
			if (this.trackMarketNameValue != this.marketData["name"]){
				this.trackMarketName.innerHTML = this.trackMarketNameValue = this.marketData["name"];	
			}
			
			if (this.trackMarketPaidPriceValue != this.marketData["pricePaid"]) {
				this.trackMarketPaidPrice.innerHTML = this.trackMarketPaidPriceValue = this.marketData["pricePaid"];
			}

			if (this.trackMarketPriceBTCValue != this.price["BTC"]) {
				this.trackMarketPriceBTC.innerHTML = this.trackMarketPriceBTCValue = this.price["BTC"];
			}

			if (this.trackMarketPriceUSDValue != this.price["USD"]) {
				this.trackMarketPriceUSD.innerHTML = this.trackMarketPriceUSDValue = this.price["USD"];
			}
		}

		return Market;

	}());

	App.Market = Market;		

})(App || (App = {}));