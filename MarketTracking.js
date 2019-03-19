
var xx = '{"ETH":{"BTC":0.06945,"USD":302.21}}';

(function(App){

	var MarketsTracking = (function(){

		// constructor
		function MarketsTracking(){
			this.markets = {};
			this.marketsInTracking = false;
			this.pollInterval = null;
		}

		MarketsTracking.prototype.addMarket = function(market){
			
			// check if market is not in the list
			if (this.markets[market.marketData["name"]] != undefined) {
				return;
			}

			// then add to tracking
			this.addMarketToQueue(market);		
		}

		MarketsTracking.prototype.removeMarket = function(removedMarket){
			var market = this.markets[removedMarket.marketData["name"]];

			// remove market from markets lookup
			if (market != undefined) {
				delete this.markets[removedMarket.marketData["name"]];
			}

			// if last market removed then clear polling interval
			if(Object.keys(this.markets).length == 0) {
				clearInterval(this.pollInterval);

				// markets are not in tracking
				this.marketsInTracking = false;
			}		

		}

		MarketsTracking.prototype.addMarketToQueue = function(market){
			this.markets[market.marketData["name"]] = market;

			// if tracking is not started yet then release it
			if(!this.marketsInTracking) {
				this.releaseMarketsTracking();
			}
		}

		MarketsTracking.prototype.releaseMarketsTracking = function(){
			var _this = this;
			this.marketsInTracking = true;

			this.startPolling();
			

			this.pollInterval = setInterval(function(){ 
				_this.startPolling();
			}, 10000);
		}

		MarketsTracking.prototype.startPolling = function(){
			var _this = this;
			var marketsNames = "";
			var req = new XMLHttpRequest();

			for(var market in this.markets){

				if (this.markets.hasOwnProperty(market)) {
					var name = this.markets[market].marketData["name"];
					marketsNames ? marketsNames += "," + name : marketsNames += name;
				}

			}

					
				// this.updateMarkets(xx);

			function reqListener () {
				// {"ETH":{"BTC":0.06945,"USD":302.21},"XRP":{"BTC":0.00004558,"USD":0.1983}}			
				_this.updateMarkets(this.responseText);
			}			

			req.addEventListener("load", reqListener);
			req.open("GET", "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + marketsNames.toUpperCase() + "&tsyms=BTC,USD");
			req.send();
		}

		MarketsTracking.prototype.updateMarkets = function(data){
			var marketData = JSON.parse(data);	

			for(var market in marketData) {
				
				if (marketData.hasOwnProperty(market)) {

					this.markets[market].price["BTC"] = marketData[market]["BTC"];
					this.markets[market].price["USD"] = marketData[market]["USD"];

					this.markets[market].updateTrackingView();
				}
			}
		}

		return MarketsTracking;

	}());

	App.MarketsTracking = MarketsTracking;		

})(App || (App = {}));