(function(){
    
    var Dom = YAHOO.util.Dom;
    var pckg = YAHOO.namespace("bravo9.yui.delegator");

    function makeEventHandler(handler, containerElementId, matchId, matchClass, matchTag) {
        return function(event) {
            var target = YAHOO.util.Event.getTarget(event);   
            while (target && target.id != containerElementId) {
                if ((null == matchId || target.id == matchId) &&
                    (null == matchTag || target.nodeName.toUpperCase() == matchTag) &&
                    (null == matchClass || Dom.hasClass(target, matchClass))) {
                        if ("Array" == typeof handler) {
                            var fn = handler[0];
                            var ob = handler[1];
                            var ov = handler[2];
                            var sc = window;
                            if (ov) {
                                if (ov == true)
                                    sc = ob;
                                else 
                                    sc = ov;
                            }
                            fn.call(sc, event, target, ob);

                        }
                        else {
                            handler(event, target);
                        }
                        break;
                } else {
                    target = target.parentNode;
                }
            }
        };
    }

    function handlerDispatch(event, target, handler) {
        if (typeof handler == "array") {
            var fn = handler[0];
            var ob = handler[1];
            var ov = handler[2];
            var sc = window;
            if (ov) {
                if (ov == true)
                    sc = ob;
                else 
                    sc = ov;
            }
            fn.call(sc, event, target, ob);

        }
        else {
            handler(event, target);
        }
    }

    function makeEventHandlerHasId(handler, containerElementId) {
        return function(event) {
            var target = YAHOO.util.Event.getTarget(event);   
            while (target && (! target.id || target.id != containerElementId)) {
                if (target.id) {
                    handlerDispatch(event, target, handler);
                    break;
                } else {
                    target = target.parentNode;
                }
            }
        };
    }

    pckg.Delegator = function(containerElement, eventType, condition, handler){
        this.containerElement = Dom.get(containerElement);
        this.eventType = eventType;
        if (! condition) condition = {};
        this.condition = condition;
        this.handler = handler;
        var eventHandler;
        if (this.condition.hasId) {
            eventHandler = makeEventHandlerHasId(handler, containerElement.id);
        }
        else {
            eventHandler = makeEventHandler(handler, containerElement.id,
                condition.matchId, 
                condition.matchClass, 
                condition.matchTag ? condition.matchTag.toUpperCase() : null); 
        }
        this.eventHandler = eventHandler;
        this._installed = false;
    };

    pckg.Delegator.prototype = {

        containerElement: null,
        type: null,
        condition: null,
        handler: null,

        install: function() {
            if (this._installed) return true;
            if (YAHOO.util.Event.addListener(this.containerElement, this.eventType, this.eventHandler)) {
                this._installed = true;
                return true;
            }
            return false;
        },

        remove: function() {
            if (! this._installed) return true;
            if (YAHOO.util.Event.removeListener(this.containerElement, this.eventType, this.eventHandler)) {
                this._installed = false;
                return true;
            }
            return false;
        }
    };

    pckg.delegate = function(containerElement, eventType, condition, handler) {
        var delegator = new pckg.Delegator(containerElement, eventType, condition, handler);
        delegator.install();
        return delegator;
    };

}());
