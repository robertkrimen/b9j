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
    b9j.namespace.declare('b9j.uri.query');

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
        else if ("" == input || input.match(/^\s/)) {
            return {};
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
 * This function is an alias for b9j.uri.query.parse( ... )
 *
 */

    pckg.parseQuery = function() {
        return _parseURIQuery.apply(null, arguments);
    };

    pckg.query.parse = function() {
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
        
/*
 * =head2 uri.clone()
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
 * Returns the query of uri, which is a b9j.uri.query.Query object
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
                this._query = new b9j.uri.query.Query(value);
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

/*
 * =head2 uri.up()
 *
 * Modify uri by updating the path to the parent of the current path. For example:
 *
 *      var uri = new b9j.uri.URI("http://example.com/a/b/c")
 *      uri.up()
 *      uri.toString() // http://example.com/a/b
 *
 */
        up: function() {
            this._path.up.apply(this._path, arguments);
            return this;
        },

/*
 * =head2 uri.down( $path )
 *
 * Modify uri by updating the path to the child of the current path by $path. For example:
 *
 *      var uri = new b9j.uri.URI("http://example.com/a/b/c")
 *      uri.down( "c/d", "e/" )
 *      uri.toString() // http://example.com/a/b/c/d/e/
 *
 */
        down: function() {
            this._path.down.apply(this._path, arguments);
            return this;
        },

/*
 * =head2 uri.parent()
 *
 * Returns a clone of uri that is the parent (path-wise) of uri. For example:
 *
 *      var uri = new b9j.uri.URI("http://example.com/a/b/c")
 *      var parent = uri.parent()
 *      uri.toString() // http://example.com/a/b/c
 *      parent.toString() // http://example.com/a/b
 *
 */
        parent: function() {
            var clone = this.clone();
            clone.up.apply(clone, arguments);
        },

/*
 * =head2 uri.child( $path )
 *
 * Returns a clone of uri that is the child (path-wise) of uri by $path. For example:
 *
 *      var uri = new b9j.uri.URI("http://example.com/a/b/c")
 *      var child = uri.child( "c/d", "e" )
 *      uri.toString() // http://example.com/a/b/c
 *      child.toString() // http://example.com/a/b/c/d/e/
 *
 */
        child: function() {
            var clone = this.clone();
            clone.down.apply(clone, arguments);
        },

/*
 * =head2 uri.set( $uri ) 
 *
 * Set the uri to $uri, completely reinitializing the object (including path and query)
 *
 */
        set: function(uri) {
            this._uri = b9j.uri.parse(uri);
            this.query(this._uri.queryHash ? this._uri.queryHash : this._uri.query);
//            delete this._uri.query;
//            delete this._uri.queryHash;
            this.path(this._uri.path);
            return this;
        },

/*
 * =head2 uri.mergeQuery( $query ) 
 *
 * Merge $query with the current query of uri
 *
 * $query can either be a query string or hash (simple object). An example:
 *
 *      var uri = new b9j.uri.URI("http://example.com/?a=1&b=2&c=3&c=4&c=5")
 *
 *      // The following are equivalent
 *      uri.mergeQuery( "b=6&b=7&c=8&d=9" )
 *      uri.mergeQuery( { b: [ 6, 7 ], c: 8, d: 9 }
 *
 *      // And will result in
 *      uri.query.toString() // a=1&b=6&b=7&c=8&d=9
 *
 */
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

/*
 * =head2 uri.toString()
 *
 * Returns uri in string-form
 *
 */
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

/*
 * =head2 b9j.uri.query.parse( $query )
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
 * =head2 new b9j.uri.query.Query( $query )
 *
 * Returns a new Query object representing $query, which can either be a (query) string or a hash resulting
 * from b9j.uri.query.parse
 *
 */

    pckg.query.Query = function(query) {
        this._store = b9j.uri.parseQuery(query);
    };

    pckg.query.Query.prototype = {

/*
 * =head2 query.clone()
 *
 * Returns a clone of query
 * 
 */

        clone: function() {
            return new b9j.uri.query.Query( b9j.clone( this._store, { shallowObject: 1 } ) );
        },

/*
 * =head2 query.get( $key )
 *
 * Returns the value for $key
 * If $key is multi-value, then return only the first value of $key
 *
 */
        get: function(key) {
            var value = this._store[key];
            if (b9j.isArray(value)) {
                return value[0];
            }
            else {
                return value;
            }
        },

/*
 * =head2 query.getAll( $key )
 *
 * Returns an array containing every value for $key
 * If $key is a single-value, then return an array with one element.
 *
 */
        getAll: function(key) {
            var value = this._store[key];
            if (b9j.isArray(value)) {
                return value;
            }
            else {
                return [ value ];
            }
        },

/*
 * =head2 query.set( $key, $value )
 *
 * Set $key to $value in query
 * $value can be a single value or an array
 *
 * =head2 query.set( $key, $value1, $value2, ... )
 *
 * Set $key to an array of [ $value1, $value2, ... ]
 *
 * Returns query
 *
 * =head2 query.set( $query )
 *
 * Set query uri to $uri, completely reinitializing the object
 *
 * $query can be a query string or hash (simple object)
 *
 * Returns query
 *
 */
        set: function(key, value) {
            
            if (arguments.length == 1) {
                this._store = b9j.uri.query.parse(key); // Not really a key, actually a query string or hash
            }
            else if (arguments.length > 2) {
                this._store[key] = Array.prototype.splice.call(arguments, 1);
            }
            else {
                this._store[key] = value;
            }

            return this;
        },

/*
 * =head2 query.add( $key, $value )
 *
 * Add $value to $key
 *
 * If $key does not exist, then $key is set to $value  
 * If $key already has a value, multiple or otherwise, then $value is appended  
 *
 * Returns query
 *
 */

        add: function(key, value) {

            if (arguments.length == 1) {
                var hash = b9j.uri.query.parse(key); // Not really a key, actually a query string or hash
                for (key in hash) {
                    this.add(key, hash[key]);
                }
            }
            else {
                var store_value;
                if (b9j.isValue(store_value = this._store[key])) {
                    if (b9j.isArray( store_value )) {
                        if (b9j.isArray( value )) {
                            store_value.splice(store_value.length, 0, value);
                        }
                        else {
                            store_value.push( value );
                        }
                    }
                    else {
                        if (b9j.isArray( value )) {
                            this._store[key] = [ store_value ].concat(value);
                        }
                        else {
                            this._store[key] = [ store_value, value ];
                        }
                    }
                }
                else {
                    this._store[key] = value;
                }
            }

            return this;
        },

/*
 * =head2 query.clear( $key )
 *
 * Clear $key from query
 *
 * Returns query
 *
 * =head2 query.clear()
 *
 * Clear every key/value from query, essentially turning it into the empty query
 *
 * Returns query
 *
 */

        clear: function(key) {

            if (arguments.length) {
                delete this._store[key];
            }
            else {
                this.set("");
            }
            
            return this;
        },

/*
 * =head2 query.merge( $query )
 *
 * Merge $query with the query
 *
 * $query can either be a query string or hash (simple object). An example:
 *
 *      var query = new b9j.uri.query.Query("a=1&b=2&c=3&c=4&c=5")
 *
 *      // The following are equivalent
 *      query.merge( "b=6&b=7&c=8&d=9" )
 *      query.merge( { b: [ 6, 7 ], c: 8, d: 9 }
 *
 *      // And will result in
 *      query.toString() // a=1&b=6&b=7&c=8&d=9
 *
 * Returns query
 *
 */
        merge: function(query) {
            query = b9j.uri.parseQuery(query);
            this._store = b9j.merge(this._store, query);
            return this;
        },

/*
 * =head2 query.isEmpty()
 *
 * Returns true if query is empty ("")
 *
 */
        isEmpty: function() {
            for (var key in this._store) {
                return false;
            }
            return true;
        },

// TODO More "empty query" testing

/*
 * =head2 query.toString()
 *
 * Returns query in string-form
 *
 */

        toString: function() {
// TODO Check if empty, first?
            var toString = "";
            var keyValueList = [];
            for (key in this._store) {
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
