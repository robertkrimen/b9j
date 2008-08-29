/* 
 * =head1 NAME
 * 
 * b9j.uri - URI
 *
 * =head1 SYNOPSIS 
 *  
 * =head1 DESCRIPTION
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.uri');

    function isValue(given) {
        var type = typeof given;
        return "string" == type || ("number" == type && isFinite(given));
            
    }

    /*
        parseUri 1.2.1
        (c) 2007 Steven Levithan <stevenlevithan.com>
        MIT License
        RFC3986 http://tools.ietf.org/html/rfc3986
    */
    function _parseURI(input, strict) {
        if (b9j.isObject(input)) {
            return input;
        }
        var parser = strict ? _parseURI.strictParser : _parseURI.looseParser;
        var queryParser = _parseURI.queryParser;
        var partName = _parseURI.partName;

        var uri = {};
        var ii = 14;

        var match = parser.exec(input);

        while (ii--) uri[partName[ii]] = match[ii] || "";

        uri.queryHash = _parseURIQuery(uri.query);

        /* TODO Report bug in original query parser */

        return uri;
    };
    _parseURI.partName = ["source","protocol","authority","userInformation","user","password","host","port","relative","path","directory","file","query","fragment"];
    _parseURI.queryParser = /(?:^|&)([^&=]*)=?([^&]*)/g;
    _parseURI.authorityParser = /^(?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?$/;
    _parseURI.hostPortParser = /^([^:\/?#]*)(?::(\d*))$/;
    _parseURI.userInformationParser = /^([^:@]*):?([^:@]*)?$/;
    _parseURI.strictParser = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
    _parseURI.looseParser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    function _parseURIAuthority(input) {
        var match = _parseURI.authorityParser.exec(input);
        if (! match) return {};
        var result = {};
        result.authority = match[0];
        result.userInformation = match[1];
        result.user = match[2];
        result.password = match[3];
        result.host = match[4];
        result.port = match[5];
        return result;
    }

    function _parseURIHostPort(input) {
        var match = _parseURI.hostPortParser.exec(input);
        if (! match) return {};
        var result = {};
        result.host = match[0];
        result.port = match[1];
        return result;
    }

    function _parseURIUserInformation(input) {
        var match = _parseURI.userInformationParser.exec(input);
        if (! match) return {};
        var result = {};
        result.userInformation = match[0];
        result.user = match[1];
        result.password = match[2];
        return result;
    }

    function _parseURIQuery(input) {
        if (b9j.isObject(input)) {
            return input;
        }
        var queryHash = {};
        input.replace(_parseURI.queryParser, function ($0, $1, $2) {
            if ($1) {
                if (! b9j.isValue(queryHash[$1])) {
                    queryHash[$1] = $2;
                }
                else if (b9j.isArray(queryHash[$1])) {
                    queryHash[$1].push($2);
                }
                else {
                    queryHash[$1] = [ queryHash[$1], $2 ];
                }
            }
        });
        return queryHash;
    }

    pckg.parse = function() {
        return _parseURI.apply(null, arguments);
    };

    pckg.parseQuery = function() {
        return _parseURIQuery.apply(null, arguments);
    };

    pckg.URI = function(uri, query) {
        this.set(uri);
        if (query) {
            this.query().merge(query);
        }
    };

    pckg.URI.prototype = {
        
        clone: function() {
            var uri = b9j.clone(this._uri);
            uri.query = b9j.clone(this._query._store, { shallowObject: 1 });
            return new b9j.uri.URI(uri);
        },

        source: function(value) {
            if (arguments.length) {
                this._uri.source = value;
                return this;
            }
            return this._uri.source;
        },

        protocol: function(value) {
            if (arguments.length) {
                this._uri.protocol = value;
                return this;
            }
            return this._uri.protocol;
        },

        authority: function(value) {
            if (arguments.length) {
                this._uri.authority = value;

                var result = _parseURIAuthority(value);
                this._uri.host = result.host;
                this._uri.port = result.port;
                this._uri.userInformation = result.userInformation;
                this._uri.user = result.user;
                this._uri.password = result.password;
                this._dirtyAuthority = false;
                this._dirtyUserInformation = false;
                
                return this;
            }
            if (this._dirtyAuthority) {
                var hostPort = "";
                hostPort = this.host();
                if ("" != hostPort && "" != this.port())
                    hostPort += ":";
                hostPort += this.port();
    
                var authority = "";
                authority += this.userInformation();
                if ("" != authority)
                    authority += "@";
                authority += hostPort;

                this._uri.authority = authority;
                this._dirtyAuthority = false;
            }
            return this._uri.authority;
        },

        host: function() {
            if (arguments.length) {
                this._uri.host = arguments[0];
                this._dirtyAuthority = true;
                return this;
            }
            return this._uri.host;
        },

        port: function() {
            if (arguments.length) {
                this._uri.port = arguments[0];
                this._dirtyAuthority = true;
                return this;
            }
            return this._uri.port;
        },

        user: function() {
            if (arguments.length) {
                this._uri.user = arguments[0];
                this._dirtyAuthority = true;
                this._dirtyUserInformation = true;
                return this;
            }
            return this._uri.user;
        },

        password: function() {
            if (arguments.length) {
                this._uri.password = arguments[0];
                this._dirtyAuthority = true;
                this._dirtyUserInformation = true;
                return this;
            }
            return this._uri.password;
        },

        userInformation: function(value) {
            if (arguments.length) {
                this._uri.userInformation = value;
                var result = _parseURIUserInformation(value);
                this._uri.user = result.user;
                this._uri.password = result.password;
                this._dirtyAuthority = true;
                return this;
            }
            if (this._dirtyUserInformation) {
                var userInformation = "";
                userInformation = this.user() + ":" + this.password();
                this._uri.userInformation = userInformation;
                this._dirtyUserInformation = false;
            }
            return this._uri.userInformation;
        },

        userInfo: function() {
            return this.userInformation.apply(this, arguments);
        },

        fragment: function() {
            if (arguments.length) {
                this._uri.fragment = arguments[0];
                return this;
            }
            return this._uri.fragment;
        },

        query: function(value) {
            if (arguments.length) {
                this._query = new b9j.uri.URIQuery(value);
                return this;
            }
            return this._query;
        },

        path: function(value) {
            if (arguments.length) {
                this._path = new b9j.path.Path(value);
                return this;
            }
            return this._path;
        },

        up: function() {
            this._path.up.apply(this._path, arguments);
            return this;
        },

        down: function() {
            this._path.down.apply(this._path, arguments);
            return this;
        },

        child: function() {
            var clone = this.clone();
            clone.down.apply(clone, arguments);
        },

        parent: function() {
            var clone = this.clone();
            clone.up.apply(clone, arguments);
        },

        set: function(uri) {
            this._uri = b9j.uri.parse(uri);
            this.query(this._uri.queryHash ? this._uri.queryHash : this._uri.query);
            delete this._uri.query;
            delete this._uri.queryHash;
            this.path(this._uri.path);
            return this;
        },

        mergeQuery: function(query) {
            this.query().merge(query);
            return this;
        },

        merge: function(uri) {
            throw new Error("URI.merge is not ready");
            if (b9j.isObject(uri)) {
                throw new Error("URI.merge(Object) is not ready");
            }
            uri = b9j.uri.parse(uri);
            var query = uri.queryHash || uri.query;
//            delete uri.query;
//            delete uri.queryHash;
//            if ("user" in uri || "password" in uri) {
//                delete uri.authority;
//                delete uri.userInformation;
//                this._dirtyAuthority = true;
//                this._dirtyUserInformation = true;
//            }
//            else if ("userInformation" in uri) {
//                delete uri.authority;
//                this._dirtyAuthority = true;
//            }
            this._uri = b9j.merge(this._uri, uri);
            this.mergeQuery(query);
            return this;
        },

        // RFC3986 http://tools.ietf.org/html/rfc3986
        toString: function() {
            var toString = "", value;

            if (! b9j.isEmpty(value = this.protocol())) {
                toString += value + ":";
            }

            if (! b9j.isEmpty(value = this.authority())) {
                toString += "//" + value;
            }

            if (! b9j.isEmpty(value = this.path().toString())) {
                toString += value
            }

            if (! this.query().isEmpty()) {
                toString += "?" + this.query().toString();
            }

            if (! b9j.isEmpty(value = this.fragment())) {
                toString += "#" + value
            }

            return toString;
        }
    };


    pckg.URIQuery = function(query) {
        this._store = b9j.uri.parseQuery(query);
    };

    pckg.URIQuery.prototype = {

        get: function(key) {
            var value = this._store[key];
            if (b9j.isArray(value)) {
                return value[0];
            }
            else {
                return value;
            }
        },

        getAll: function(key) {
            var value = this._store[key];
            if (b9j.isArray(value)) {
                return value;
            }
            else {
                return [ value ];
            }
        },

        set: function(key, value) {
            
            if (arguments.length == 1) {
                this._store = b9j.uri.parseQuery(key); // Not really a key, actually a query string
            }

            return this._store[key] = value;
        },

        merge: function(query) {
            query = b9j.uri.parseQuery(query);
            this._store = b9j.merge(this._store, query);
        },

        isEmpty: function() {
            for (var key in this._store) {
                return false;
            }
            return true;
        },

        toString: function() {
            var toString = "";
            var keyValueList = [];
            for (var key in this._store) {
                var value = this._store[key];
                if (b9j.isArray(value)) {
                    for (var ii = 0; ii < value.length; ii++) {
                        keyValueList.push(encodeURIComponent(key) + "=" + encodeURIComponent(value[ii]));
                    }
                }
                else {
                    keyValueList.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
                }
            } 
            toString = keyValueList.join("&");
            return toString;
        }

    };

}());
