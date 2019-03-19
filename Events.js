(function(App){

	// Events class to add, remove and dispatch listeners
	var Events = (function(){

		var handlersLookup = {};

		// constructor
		function Events(){
		}

		Events.prototype.toString = function() {
			return ["Events"];
		}

		Events.prototype.dispatch = function(event) {
			if (event.target) {
				event.currentTarget = this;
			} else {
				event.target = event.currentTarget = this;
			}

			if(!this._eRegister) {
				return;
			}

			var type = event.type;
			var list = this._eRegister[type];
			var item;
			if(list) {
				if(this._touchList[type]) {
					this.cleanRegister(type);
				}

				// dispatch
				for (var i = 0; i < list.length; i++) {
					item = list[i];

					try {
						if(item) {
							item.method.call(item.scope, event);
						}
					} catch (error) {
						console.log("Events: ", error);
					}
				}
			}
		}

		Events.prototype.addEventListener = function(type, handler) {
			if(!this._eRegister) {
				this._eRegister = {};
				this._touchList = {};
			}

			var list = this._eRegister[type];
			if(list) {
				list[list.length] = handler;
			} else {
				this._eRegister[type] = [handler];
			}
		}

		Events.prototype.bubbleEvent = function() {
			this.dispatchEvent(event);
			if(!event.stopPropagation) {
				var p = this.parent;
				while(p) {
					if(p.bubbleEvent) {
						p.bubbleEvent(event);
						break;
					}
					p = p.parent;
				}
			}
		}

		Events.prototype.removeEventListener = function(type, handler) {
			if(!this._eRegister) {
				return;
			}

			var list = this._eRegister[type];
			var index;
			if(list && (index = list.indexOf(handler)) > -1) {
				list[index] = undefined;
				this._touchList[type] = true;
			}
		}

		Events.prototype.hasEventListener = function(type) {
			if(!this._eRegister) {
				return false;
			}
			if(this._touchList[type]) {
				this.cleanRegister(type);
			}
			var list = this._eRegister[type];
			return list && list.length > 0;
		}

		Events.prototype.hasEventListenerWithDelegate = function(type, handler) {
			if(!this._eRegister) {
				return false;
			}
			if(this._touchList[type]) {
				this.cleanRegister(type);
			}
			var list = this._eRegister[type];

			if(list && this._eRegister[type]) {
				return true;
			}
			return false;
		}

		Events.prototype.cleanRegister = function(type) {
			this._touchList[type] = false;

			var list = this._eRegister[type];
			var tmplist = [];
			for (var i = 0, list_1 = list; i < list_1.length; i++) {
				var item = list_1[i];
				if(item) {
					tmplist[tmplist.length] = iteml
				}
			}
			this._eRegister[type] = tmplist;
		}

		return Events;

	}());

	Events.SInit = (function() {
		Events.prototype._eRegister = null;
		Events.prototype._touchList = null;
	}());

	App.Events = Events;

})(App || (App = {}));