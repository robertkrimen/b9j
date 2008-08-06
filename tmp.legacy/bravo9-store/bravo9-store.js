;(function(){
    
    var pckg = YAHOO.namespace("bravo9.store");

    pckg.Store = function(_inflator) {
        this._store = {};
        this._inflator = _inflator;
    };
    pckg.Store.prototype = {

        _store: null,
        _inflator: null,

        insert: function(item) {
            if (! item.meta_store) item = this.inflate(item);
            this._store[item.key] = item;
            return item;
        },

        remove: function(key) {
            var item = this._store[key];
            delete this._store[key];
            return item;
        },

        find: function(key) {
            return this._store[key];
        },

        all: function() {
            return YAHOO.bravo9.more.values(this._store);
        },

        clear: function() {
            delete this._store;
            this._store = {};
        },

        inflate: function(storage) {
            var item = this._inflator(storage);
            if (! item.meta_store) item.meta_store = {};
            return item;
        }
    };

}());
