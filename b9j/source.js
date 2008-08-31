/*
 * =head1 NAME
 *
 * b9j - A JavaScript toolkit
 *
 * =head1 VERSION
 *
 * Version 0.1.3
 *
 * =head1 CATALOG
 *
 * [b9j.namespace](http://appengine.bravo9.com/b9j/documentation/namespace.html) - Namespace creation and aliasing  
 * [b9j.test](http://appengine.bravo9.com/b9j/documentation/test.html) - A wrapper around YUI Test to make simple testing easy  
 * [b9jTest](http://appengine.bravo9.com/b9j/documentation/b9jTest.html)  - A bundled version of b9j.test  
 * [b9j.path](http://appengine.bravo9.com/b9j/documentation/path.html) - UNIX-style path parsing, manipulation, and generation  
 * [b9j.uri](http://appengine.bravo9.com/b9j/documentation/uri.html)  - URI (Uniform Resource Identifier) parsing, manipulation, and generation  
 * [b9j.uri.query](http://appengine.bravo9.com/b9j/documentation/uri.html) - URI query parsing, manipulation, and generation  
 * [b9j.digest.sha256](http://appengine.bravo9.com/b9j/documentation/digest.html) - A SHA-256 digester  
 * [b9j.random](http://appengine.bravo9.com/b9j/documentation/random.html) - Generate pseudo-random binary, hexadecimal, or base64 data of arbritrary length
 *
 * =head2 b9j.namespace - Namespace creation and aliasing
 *
 *          declare         # Declare a namespace
 *          using           # Alias one or more namespace(s) to a shorthand name
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/namespace.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/namespace.html)
 *
 * =head2 b9j.test - A wrapper around YUI Test to make simple testing easy
 *
 *          b9jTest         # An easy-to-use test framework based on YUI Test
 *                          # NOTE: Requires YUI Test to be loaded
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/test.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/test.html)
 *
 * =head2 b9jTest - A bundled version of b9j.test
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/b9jTest.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/b9jTest.html)
 *
 * =head2 b9j.path - UNIX-style path parsing, manipulation, and generation
 *
 *          Path            # A class representing a URI/UNIX-style path
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/path.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/path.html)
 *
 * =head2 b9j.uri - URI (Uniform Resource Identifier) parsing, manipulation, and generation
 *
 *          URI             # A class representing a URI
 *          parse           # Parse a URI string
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/uri.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/uri.html)
 *
 * =head2 b9j.uri.query - URI query parsing, manipulation, and generation
 *
 *          Query           # A class representing a URI query
 *          parse           # Parse a URI query string
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/uri.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/uri.html)
 *
 * =head2 b9j.digest.sha256 - A SHA-256 digester
 *
 *          calculate16     # Return a SHA-256 digest as a hexadecimal (base16) value
 *          calculate64     # Return a SHA-256 digest as a base64 value
 *          calculate       # Return a SHA-256 digest as a binary string (base256) value
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/digest.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/digest.html)
 *
 * =head2 b9j.random - Generate pseudo-random binary, hexadecimal, or base64 data of arbritrary length
 *
 *          generate16      # Return a pseudo-random hexadecimal (base16) value
 *          generate64      # Return a pseudo-random base64 value
 *          generate        #  Return a pseudo-random binary value
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/random.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/random.html)
 *
 * =head1 AUTHOR
 *
 * Robert Krimen `<robertkrimen at gmail.com>` [http://bravo9.com](http://bravo9.com)
 *
 * =head1 DOWNLOAD
 *
 * Available as part of [**b9j**](http://appengine.bravo9.com/b9j): [b9j-latest.zip](http://appengine.bravo9.com/b9j/b9j-latest.zip)
 *
 * =head1 SOURCE
 *
 * You can contribute or fork this project via GitHub:
 *
 * [http://github.com/robertkrimen/b9j/tree/master](http://github.com/robertkrimen/b9j/tree/master)
 *
 *      git clone git://github.com/robertkrimen/b9j.git
 *
 * =head1 COPYRIGHT & LICENSE
 *
 * Copyright 2008 Robert Krimen
 *
 * Code licensed under the BSD License: [http://appengine.bravo9.com/b9j/documentation/license.txt](http://appengine.bravo9.com/b9j/documentation/license.txt)
 *
 */

if (typeof b9j == "undefined" || !b9j) {
    var b9j = {};
}

(function(){

    // '_namespace' adapted from work by Karl Krukow
    // http://higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing

    var namespaceRE = b9j._namespaceRE = /^(?:[a-zA-Z_]\w*[.])*[a-zA-Z_]\w*$/;
    function _namespace(namespace, context) {
        var ii, limit;

        context = context || window;
        if (! context) {
            throw new Error('Not given context and "window" is undefined');
        }

        namespace = namespace.valueOf();
        if ('string' == typeof namespace) {
            if (! namespaceRE.test(namespace)) {
            throw new Error('"'+namespace+'" is not a valid namespace specification');
            }
            var parts = namespace.split('.');
            for (ii = 0, limit = parts.length; ii < limit; ii++) {
                var part = parts[ii];
                context = (context[part] = context[part] || {});
            }
        }
        else if ('object' == typeof namespace) {
            if ('number' == typeof namespace.length && 'function' == typeof namespace.splice) {
                // It's an array!
                for (ii = 0, limit = namespace.length; ii < limit; ii++) {
                    _namespace(namespace[ii], context);
                }
            }
            else {
                for (ii in namespace) {
                    if (namespace.hasOwnProperty(ii)) {
                        context[ii] = context[ii] || {};
                        _namespace(namespace[ii], context[ii]);
                    }
                }
            }
        }
        else {
            throw new TypeError;
        }

        return context;
    };

    b9j._namespace = _namespace;

    b9j.isArray = YAHOO.lang.isArray;
    b9j.isBoolean = YAHOO.lang.isBoolean;
    b9j.isFunction = YAHOO.lang.isFunction
    b9j.isNull = YAHOO.lang.isNull;
    b9j.isNumber = YAHOO.lang.isNumber;
    b9j.isObject = YAHOO.lang.isObject;
    b9j.isString = YAHOO.lang.isString;
    b9j.isUndefined = YAHOO.lang.isUndefined;
    b9j.isValue = YAHOO.lang.isValue;
    b9j.isEmpty = function(value) {
        if (b9j.isObject(value)) {
            for (var ii in value) {
                return false;
            }
        }
        else if (b9j.isValue(value)) {
            return "" == value;
        }
        return true;
    };

    b9j.toArray = function(given) {
        return Array.prototype.splice.call(given, 0);
    }

    function merge(left, right) {
        var result = {}
        if (arguments.length == 1) {
            for (ii in left) { 
                if (left.hasOwnProperty(ii)) {
                    result[ii] = left[ii];
                }
            }
        }
        else if (arguments.length == 2) {
            var hl, hr;
            result = merge(left); // Shallow copy
            for (ii in right) {
                if (right.hasOwnProperty(ii)) {
                    hl = b9j.isObject(left[ii]);
                    hr = b9j.isObject(right[ii]);
    
                    if (hl && hr) {
                        result[ii] = merge(left[ii], right[ii]);
                    }
                    else {
                        result[ii] = right[ii]
                    }
                }
            }
        }
        else if (arguments.length > 2) {
            var right_arguments = Array.prototype.splice.call(arguments, 1);
            result = merge(left, merge.apply(this, right_arguments));
        }
        return result;
    }
    b9j.merge = merge;

    function clone(value, given) {
        if (!given) given = {};
        if (b9j.isArray(value)) {
            var copy = [].concat(value); // Shallow copy
            if (given.shallow || given.shallowArray) {
            }
            else {
                for (var ii = 0; ii < copy.length; ii++) {
                    var value = copy[ii];
                    if (b9j.isObject(value))
                        copy[ii] = clone(value, given);
                }
            }
            return copy;
        }
        else if (b9j.isObject(value)) {
            var copy = merge(value); // Shallow copy
            if (given.shallow) {
            }
            else if (given.shallowObject) {
                for (ii in copy) {
                    if (copy.hasOwnProperty(ii)) {
                        var value = copy[ii];
                        if (b9j.isArray(value))
                            copy[ii] = clone(value, given);
                    }
                }
            }
            else {
                for (ii in copy) {
                    if (copy.hasOwnProperty(ii)) {
                        var value = copy[ii];
                        if (b9j.isObject(value))
                            copy[ii] = clone(value, given);
                    }
                }
            }
            return copy;
        }
        return value;
    }
    b9j.clone = clone;

})();

/*

    // http://higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing

    function namespace(spec,context) {
        var validIdentifier = /^(?:[a-zA-Z_]\w*[.])*[a-zA-Z_]\w*$/,
            i,N;
        context = context || window;
        spec = spec.valueOf();
        if (typeof spec === 'object') {
                if (typeof spec.length === 'number') {//assume an array-like object
                    for (i=0,N=spec.length;i<N;i++) {
                        namespace(spec[i],context);
                    }
                }
                else {//spec is a specification object e.g, {com: {trifork: ['model,view']}}
                    for (i in spec) if (spec.hasOwnProperty(i)) {
                        context[i] = context[i] || {};
                        namespace(spec[i], context[i]);//recursively descend tree
                    }
                }
        } else if (typeof spec === 'string') {
                (function handleStringCase(){
                   var parts;
                   if (!validIdentifier.test(spec)) {
                       throw new Error('"'+spec+'" is not a valid name for a package.');
                   }
                   parts = spec.split('.');
                   for (i=0,N=parts.length;i<N;i++) {
                       spec = parts[i];
                       context[spec] = context[spec] || {};
                       context = context[spec];
                   }
                })();
        }
        else {
           throw new TypeError();
        }
    }

*/
