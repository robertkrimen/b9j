;(function(){
    
    var pckg = YAHOO.namespace("bravo9.more");

    pckg.values = function(item) {
        var values = [];
        for (var property in item) {
            values.push(item[property]);
        }
        return values;
    };

    pckg.keys = function(item) {
        var keys = [];
        for (var property in item) {
            keys.push(property);
        }
        return keys;
    };

    pckg.putInto = function(from, to, want) {
        if (want) want = pckg.hashIt(want);
        for (var property in from) {
            if (! want || want[property]) {
                to[property] = from[property];
            }
        }
    };

    pckg.define = function(value, default_) {
        if (null == value) return default_;
        return value;
    };

    pckg.emptyDefine = function(value, default_) {
        if (null == value || (typeof value == "string" && ! value.length)) return default_;
        return value;
    };

    pckg.hashIt = function(list, value) {
        var hash = {};
        if (undefined == value || null == value) value = 1;
        for (var ii = 0; ii < list.length; ++ii) {
            hash[list[ii]] = value;
        }
        return hash;
    };

    pckg.form = {
        
        slice: function(form, want) {
            var slice = {};
            var elements = form.elements;
            if (want) want = pckg.hashIt(want);
            for (var ii = 0; ii < elements.length; ++ii) {
                var element = elements[ii];
                if (! want || want[element.name]) {
                    slice[element.name] = element.value;
                }
            }
            return slice;
        }
    };

}());
