;(function(){
    
    var pckg = YAHOO.namespace("bravo9.signal");
    var _signatureSoup = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var _signatureSoup_length = _signatureSoup.length;
    
    pckg.random = function(length) {
        if (! length) length = 8
        var random = "";
        for (ii = 1; ii <= length; ii++) {
            random = random + _signatureSoup.charAt(Math.floor(Math.random() * _signatureSoup_length));
        }
        return random;
    }

    pckg.SignalManager = function(){
        this._lookup = {};
        this._typeLookup = {};
    };

    pckg.SignalManager.prototype = {

        _uniqueSignature: function() {
            var ii;
            while (true) {
                var signature = pckg.random()
                if (! this._lookup[signature])
                    return signature;
            }
            return null; // Should never get here!
        },

        fire: function(signature, type, fireContext) {
            var lookup = this.lookupFor(type);
            var handlerContext = lookup[signature];
            if (! handlerContext) return false;

            var handler = handlerContext[0];
            var context = handlerContext[1];

            if ("array" == typeof handler) {
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
                fn.call(sc, context, fireContext, ob);
            }
            else {
                handler(context, fireContext);
            }

            return true;
        },

        lookupFor: function(type) {
            if (! this._typeLookup[type]) {
                return this._typeLookup[type] = {};
            }
            return this._typeLookup[type];
        },

        doesExist: function(signature) {
            return this._lookup[signature] ? true : false;
        },

        subscribe: function(type, handler, context) {
            var signature = this._uniqueSignature();
            this.lookupFor(type)[signature] = [ handler, context ];
            this._lookup[signature] = true;
            return signature;
        }
    };

}());


