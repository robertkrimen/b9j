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

/*
 * =head1 METHODS
 *
 */

/*
 * =head2 b9j.uri.parse( $uri )
 *
 * Parse $uri (which should be a string) and return a hash containing the following:
 *  
 *      protocol
 *      authority
 *      userInformation
 *      user
 *      password
 *      host
 *      port
 *      relative
 *      path
 *      directory
 *      file
 *      query
 *      queryHash
 *      fragment
 *
 * An example:
 *
 *      ... = b9j.uri.parse("http://example.com:8080/?a=1&b=2")
 *  
 * See also [RFC3986 (http://tools.ietf.org/html/rfc3986)](http://tools.ietf.org/html/rfc3986)
 *
 * This method is adapted from [parseUri 1.2](http://blog.stevenlevithan.com/archives/parseuri) by Steven Levithan
 *
 */
    pckg.parse = function() {
        return _parseURI.apply(null, arguments);
    };

/*
 * =head2 b9j.uri.parseQuery( $query )
 *
 * Parse $query (which should be a string) and return a key/value hash:
 *
 *      var hash = b9j.uri.parseQuery("a=1&b=2")
 *      // hash is { a: 1, b: 2 }
 *
 * If the the query string contains a multi-value key, then that key is represented
 * in the hash by an array instead of a simple value:
 *
 *      var hash = b9j.uri.parseQuery("a=1&b=2&c=4&c=5&c=6")
 *      // hash is { a: 1, b: 2, c: [ 4, 5, 6 ] }
 *
 */
    pckg.parseQuery = function() {
        return _parseURIQuery.apply(null, arguments);
    };

/*
 * =head2 new b9j.uri.Uri( $uri )
 *
 * Returns a new URI object representing $uri, which can either be a string or a hash resulting
 * from b9j.uri.parse
 *
 */

    pckg.URI = function(uri, query) {
        this.set(uri);
        if (query) { // This should probably set query
            this.mergeQuery(query);
        }
    };

    pckg.URI.prototype = {
        
/* =head2 uri.clone()
 *
 * Returns a clone of uri
 * 
 */


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

/*
 * =head2 uri.protocol()
 *
 * Returns the protocol of uri, which is something like `http`, `https`, `ftp`, ...
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => http
 *
 * =head2 uri.protocol( $protocol )
 *
 * Sets the protocol of uri to $protocol
 *
 * Returns uri
 *
 */
        protocol: function(value) {
            if (arguments.length) {
                this._uri.protocol = value;
                return this;
            }
            return this._uri.protocol;
        },

/*
 * =head2 uri.authority() 
 *
 * Returns the authority of uri, which is something like `example.com:80` or `user:password@www.example.net`
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => alice:xyzzy@www.example.net
 *
 * =head2 uri.authority( $authority )
 *
 * Sets the authority of uri to $authority
 *
 * Returns uri
 *
 */
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

/*
 * =head2 uri.host()
 *
 * Returns the host of uri, which is something like `example.com` or `www.example.net`
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => www.example.net
 *
 * =head2 uri.host( $host )
 *
 * Sets the host of uri to $host
 *
 * Returns uri
 *
 */
        host: function() {
            if (arguments.length) {
                this._uri.host = arguments[0];
                this._dirtyAuthority = true;
                return this;
            }
            return this._uri.host;
        },

/*
 * =head2 uri.port()
 *
 * Returns the port of uri, which can be empty (think default port) or something like `8080`, `8000`, ...
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => 8080
 *
 * =head2 uri.port( $port )
 *
 * Sets the port of uri to $port
 *
 * Returns uri
 *
 */

// TODO Test setting the "empty" port

        port: function() {
            if (arguments.length) {
                this._uri.port = arguments[0];
                this._dirtyAuthority = true;
                return this;
            }
            return this._uri.port;
        },

/*
 * =head2 uri.user()
 *
 * Returns the user of uri, if any
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => alice
 *
 * =head2 uri.user( $user )
 *
 * Sets the user of uri to $user
 *
 * Returns uri
 *
 */

        user: function() {
            if (arguments.length) {
                this._uri.user = arguments[0];
                this._dirtyAuthority = true;
                this._dirtyUserInformation = true;
                return this;
            }
            return this._uri.user;
        },

/*
 * =head2 uri.password()
 *
 * Returns the password of uri, if any
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => xyzzy
 *
 * =head2 uri.password( $password )
 *
 * Sets the password of uri to $password
 *
 * Returns uri
 *
 */

        password: function() {
            if (arguments.length) {
                this._uri.password = arguments[0];
                this._dirtyAuthority = true;
                this._dirtyUserInformation = true;
                return this;
            }
            return this._uri.password;
        },

/*
 * =head2 uri.userInformation()
 *
 * =head2 uri.userInfo()
 *
 * Returns the userInformation of uri, if any. The user information is usually something like `user:password`
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => alice:xyzzy
 *
 * =head2 uri.userInformation( $userInformation )
 *
 * =head2 uri.userInfo( $userInformation )
 *
 * Sets the userInformation of uri $userInformation, which will in turn update user, password, and authority appropiately
 *
 * Returns uri
 *
 */
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

/*
 * =head2 uri.fragment()
 *
 * Returns the fragment of uri, if any
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => top
 *
 * =head2 uri.fragment( $fragment )
 *
 * Sets the fragment of uri to $fragment
 *
 * Returns uri
 *
 */
        fragment: function() {
            if (arguments.length) {
                this._uri.fragment = arguments[0];
                return this;
            }
            return this._uri.fragment;
        },

/*
 * =head2 uri.query()
 *
 * Returns the query of uri, which is a b9j.uri.URIQuery object
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => a=1&b=2&c=3&c=4&c=5
 *
 * You can make changes to the returned query object, and these will be reflected in uri
 *
 * =head2 uri.query( $query )
 *
 * Sets the query of uri to $query, which can be either a string or a key/value hash. For example
 *
 *      // The following are equivalent
 *      uri.query( "a=1&b=1&b=2" )
 *      uri.query( { a: 1, b: [ 1, 2 ] } ) 
 *
 * Returns uri
 *
 */
        query: function(value) {
            if (arguments.length) {
                this._query = new b9j.uri.URIQuery(value);
                return this;
            }
            return this._query;
        },

/*
 * =head2 uri.path()
 *
 * Returns the path of uri, which is a b9j.path.Path object
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => /apple/banana/
 *
 * You can make changes to the returned path object, and these will be reflected in uri
 *
 * =head2 uri.path( $path )
 *
 * Sets the path of uri to $path, which can be either a string or an array of path parts
 *
 *      // The following are equivalent
 *      uri.path( "a/b/c" )
 *      uri.path( [ 'a', 'b', 'c' ] )
 *
 * Returns uri
 *
 */

// TODO Make sure path isTree()

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

        _merge: function(uri) {
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
