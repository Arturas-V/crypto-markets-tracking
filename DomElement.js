(function(App){
	var Events = App.Events;

	// DomElement base class for Components to inherit from
	var DomElement = (function(){

		__extend(DomElement, Events);

		// constructor
		function DomElement(){			
		}

		// DomElement.prototype.classLookup = {};	

		DomElement.prototype.hideElement = function(elem){
			this.addStyle(elem, "hidden");
		}

		DomElement.prototype.showElement = function(elem){
			this.removeStyle(elem, "hidden");
		}

		DomElement.prototype.addStyle = function(elem, val){
			if(elem.className.indexOf(val) > -1) {
				return;
			}
			elem.className = elem.className + " " + val;
		}

		DomElement.prototype.removeStyle = function(elem, val){
			if(elem.className.indexOf(val) == -1) {
				return;
			}

			elem.classNames = elem.className.replace(" "+val, "");
			elem.className = elem.classNames;
		}

		return DomElement;

	}());

	App.DomElement = DomElement;		

})(App || (App = {}));