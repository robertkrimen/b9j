/*
 * =head1 NAME 
 * 
 * b9j.yui - Minimally bootstrap YAHOO and YAHOO.lang (if not available)
 *
 */

if(typeof YAHOO=="undefined" || !YAHOO) { // Only load if YAHOO does not exists

    var YAHOO = {};
    /*
        Copyright (c) 2008, Yahoo! Inc. All rights reserved.
        Code licensed under the BSD License:
        http://developer.yahoo.net/yui/license.txt
        version: 2.5.2
    */

/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
*/
/**
 * The YAHOO object is the single global object used by YUI Library.  It
 * contains utility function for setting up namespaces, inheritance, and
 * logging.  YAHOO.util, YAHOO.widget, and YAHOO.example are namespaces
 * created automatically for and used by the library.
 * @module yahoo
 * @title  YAHOO Global
 */

/**
 * YAHOO_config is not included as part of the library.  Instead it is an 
 * object that can be defined by the implementer immediately before 
 * including the YUI library.  The properties included in this object
 * will be used to configure global properties needed as soon as the 
 * library begins to load.
 * @class YAHOO_config
 * @static
 */

/**
 * A reference to a function that will be executed every time a YAHOO module
 * is loaded.  As parameter, this function will receive the version
 * information for the module. See <a href="YAHOO.env.html#getVersion">
 * YAHOO.env.getVersion</a> for the description of the version data structure.
 * @property listener
 * @type Function
 * @static
 * @default undefined
 */

/**
 * Set to true if the library will be dynamically loaded after window.onload.
 * Defaults to false 
 * @property injecting
 * @type boolean
 * @static
 * @default undefined
 */

/**
 * Instructs the yuiloader component to dynamically load yui components and
 * their dependencies.  See the yuiloader documentation for more information
 * about dynamic loading
 * @property load
 * @static
 * @default undefined
 * @see yuiloader
 */

/**
 * Forces the use of the supplied locale where applicable in the library
 * @property locale
 * @type string
 * @static
 * @default undefined
 */

/**
 * Returns the namespace specified and creates it if it doesn't exist
 * <pre>
 * YAHOO.namespace("property.package");
 * YAHOO.namespace("YAHOO.property.package");
 * </pre>
 * Either of the above would create YAHOO.property, then
 * YAHOO.property.package
 *
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 * <pre>
 * YAHOO.namespace("really.long.nested.namespace");
 * </pre>
 * This fails because "long" is a future reserved word in ECMAScript
 *
 * @method namespace
 * @static
 * @param  {String*} arguments 1-n namespaces to create 
 * @return {Object}  A reference to the last namespace object created
 */
YAHOO.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=YAHOO;

        // YAHOO is implied, so it is ignored if it is included
        for (j=(d[0] == "YAHOO") ? 1 : 0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }

    return o;
};

/**
 * Uses YAHOO.widget.Logger to output a log message, if the widget is
 * available.
 *
 * @method log
 * @static
 * @param  {String}  msg  The message to log.
 * @param  {String}  cat  The log category for the message.  Default
 *                        categories are "info", "warn", "error", time".
 *                        Custom categories can be used as well. (opt)
 * @param  {String}  src  The source of the the message (opt)
 * @return {Boolean}      True if the log operation was successful.
 */
YAHOO.log = function(msg, cat, src) {
    var l=YAHOO.widget.Logger;
    if(l && l.log) {
        return l.log(msg, cat, src);
    } else {
        return false;
    }
};

/**
 * Registers a module with the YAHOO object
 * @method register
 * @static
 * @param {String}   name    the name of the module (event, slider, etc)
 * @param {Function} mainClass a reference to class in the module.  This
 *                             class will be tagged with the version info
 *                             so that it will be possible to identify the
 *                             version that is in use when multiple versions
 *                             have loaded
 * @param {Object}   data      metadata object for the module.  Currently it
 *                             is expected to contain a "version" property
 *                             and a "build" property at minimum.
 */
YAHOO.register = function(name, mainClass, data) {
    var mods = YAHOO.env.modules;
    if (!mods[name]) {
        mods[name] = { versions:[], builds:[] };
    }
    var m=mods[name],v=data.version,b=data.build,ls=YAHOO.env.listeners;
    m.name = name;
    m.version = v;
    m.build = b;
    m.versions.push(v);
    m.builds.push(b);
    m.mainClass = mainClass;
    // fire the module load listeners
    for (var i=0;i<ls.length;i=i+1) {
        ls[i](m);
    }
    // label the main class
    if (mainClass) {
        mainClass.VERSION = v;
        mainClass.BUILD = b;
    } else {
        YAHOO.log("mainClass is undefined for module " + name, "warn");
    }
};

/**
 * YAHOO.env is used to keep track of what is known about the YUI library and
 * the browsing environment
 * @class YAHOO.env
 * @static
 */
YAHOO.env = YAHOO.env || {

    /**
     * Keeps the version info for all YUI modules that have reported themselves
     * @property modules
     * @type Object[]
     */
    modules: [],
    
    /**
     * List of functions that should be executed every time a YUI module
     * reports itself.
     * @property listeners
     * @type Function[]
     */
    listeners: []
};

/**
 * Returns the version data for the specified module:
 *      <dl>
 *      <dt>name:</dt>      <dd>The name of the module</dd>
 *      <dt>version:</dt>   <dd>The version in use</dd>
 *      <dt>build:</dt>     <dd>The build number in use</dd>
 *      <dt>versions:</dt>  <dd>All versions that were registered</dd>
 *      <dt>builds:</dt>    <dd>All builds that were registered.</dd>
 *      <dt>mainClass:</dt> <dd>An object that was was stamped with the
 *                 current version and build. If 
 *                 mainClass.VERSION != version or mainClass.BUILD != build,
 *                 multiple versions of pieces of the library have been
 *                 loaded, potentially causing issues.</dd>
 *       </dl>
 *
 * @method getVersion
 * @static
 * @param {String}  name the name of the module (event, slider, etc)
 * @return {Object} The version info
 */
YAHOO.env.getVersion = function(name) {
    return YAHOO.env.modules[name] || null;
};

/**
 * Do not fork for a browser if it can be avoided.  Use feature detection when
 * you can.  Use the user agent as a last resort.  YAHOO.env.ua stores a version
 * number for the browser engine, 0 otherwise.  This value may or may not map
 * to the version number of the browser using the engine.  The value is 
 * presented as a float so that it can easily be used for boolean evaluation 
 * as well as for looking for a particular range of versions.  Because of this, 
 * some of the granularity of the version info may be lost (e.g., Gecko 1.8.0.9 
 * reports 1.8).
 * @class YAHOO.env.ua
 * @static
 */
YAHOO.env.ua = function() {
    var o={

        /**
         * Internet Explorer version number or 0.  Example: 6
         * @property ie
         * @type float
         */
        ie:0,

        /**
         * Opera version number or 0.  Example: 9.2
         * @property opera
         * @type float
         */
        opera:0,

        /**
         * Gecko engine revision number.  Will evaluate to 1 if Gecko 
         * is detected but the revision could not be found. Other browsers
         * will be 0.  Example: 1.8
         * <pre>
         * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7
         * Firefox 1.5.0.9: 1.8.0.9 <-- Reports 1.8
         * Firefox 2.0.0.3: 1.8.1.3 <-- Reports 1.8
         * Firefox 3 alpha: 1.9a4   <-- Reports 1.9
         * </pre>
         * @property gecko
         * @type float
         */
        gecko:0,

        /**
         * AppleWebKit version.  KHTML browsers that are not WebKit browsers 
         * will evaluate to 1, other browsers 0.  Example: 418.9.1
         * <pre>
         * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the 
         *                                   latest available for Mac OSX 10.3.
         * Safari 2.0.2:         416     <-- hasOwnProperty introduced
         * Safari 2.0.4:         418     <-- preventDefault fixed
         * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run
         *                                   different versions of webkit
         * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been
         *                                   updated, but not updated
         *                                   to the latest patch.
         * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native SVG
         *                                   and many major issues fixed).  
         * 3.x yahoo.com, flickr:422     <-- Safari 3.x hacks the user agent
         *                                   string when hitting yahoo.com and 
         *                                   flickr.com.
         * Safari 3.0.4 (523.12):523.12  <-- First Tiger release - automatic update
         *                                   from 2.x via the 10.4.11 OS patch
         * Webkit nightly 1/2008:525+    <-- Supports DOMContentLoaded event.
         *                                   yahoo.com user agent hack removed.
         *                                   
         * </pre>
         * http://developer.apple.com/internet/safari/uamatrix.html
         * @property webkit
         * @type float
         */
        webkit: 0,

        /**
         * The mobile property will be set to a string containing any relevant
         * user agent information when a modern mobile browser is detected.
         * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series
         * devices with the WebKit-based browser, and Opera Mini.  
         * @property mobile 
         * @type string
         */
        mobile: null,

        /**
         * Adobe AIR version number or 0.  Only populated if webkit is detected.
         * Example: 1.0
         * @property air
         * @type float
         */
        air: 0

    };

    var ua=navigator.userAgent, m;

    // Modern KHTML browsers should qualify as Safari X-Grade
    if ((/KHTML/).test(ua)) {
        o.webkit=1;
    }
    // Modern WebKit browsers are at least X-Grade
    m=ua.match(/AppleWebKit\/([^\s]*)/);
    if (m&&m[1]) {
        o.webkit=parseFloat(m[1]);

        // Mobile browser check
        if (/ Mobile\//.test(ua)) {
            o.mobile = "Apple"; // iPhone or iPod Touch
        } else {
            m=ua.match(/NokiaN[^\/]*/);
            if (m) {
                o.mobile = m[0]; // Nokia N-series, ex: NokiaN95
            }
        }

        m=ua.match(/AdobeAIR\/([^\s]*)/);
        if (m) {
            o.air = m[0]; // Adobe AIR 1.0 or better
        }

    }

    if (!o.webkit) { // not webkit
        // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
        m=ua.match(/Opera[\s\/]([^\s]*)/);
        if (m&&m[1]) {
            o.opera=parseFloat(m[1]);
            m=ua.match(/Opera Mini[^;]*/);
            if (m) {
                o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
            }
        } else { // not opera or webkit
            m=ua.match(/MSIE\s([^;]*)/);
            if (m&&m[1]) {
                o.ie=parseFloat(m[1]);
            } else { // not opera, webkit, or ie
                m=ua.match(/Gecko\/([^\s]*)/);
                if (m) {
                    o.gecko=1; // Gecko detected, look for revision
                    m=ua.match(/rv:([^\s\)]*)/);
                    if (m&&m[1]) {
                        o.gecko=parseFloat(m[1]);
                    }
                }
            }
        }
    }
    
    return o;
}();

/*
 * Initializes the global by creating the default namespaces and applying
 * any new configuration information that is detected.  This is the setup
 * for env.
 * @method init
 * @static
 * @private
 */
(function() {
    YAHOO.namespace("util", "widget", "example");
    if ("undefined" !== typeof YAHOO_config) {
        var l=YAHOO_config.listener,ls=YAHOO.env.listeners,unique=true,i;
        if (l) {
            // if YAHOO is loaded multiple times we need to check to see if
            // this is a new config object.  If it is, add the new component
            // load listener to the stack
            for (i=0;i<ls.length;i=i+1) {
                if (ls[i]==l) {
                    unique=false;
                    break;
                }
            }
            if (unique) {
                ls.push(l);
            }
        }
    }
})();
/**
 * Provides the language utilites and extensions used by the library
 * @class YAHOO.lang
 */
YAHOO.lang = YAHOO.lang || {};

(function() {

var L = YAHOO.lang,

    // ADD = ["toString", "valueOf", "hasOwnProperty"],
    ADD = ["toString", "valueOf"],

    OB = {

    /**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame 
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * @method isArray
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isArray: function(o) { 
        if (o) {
           return L.isNumber(o.length) && L.isFunction(o.splice);
        }
        return false;
    },

    /**
     * Determines whether or not the provided object is a boolean
     * @method isBoolean
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isBoolean: function(o) {
        return typeof o === 'boolean';
    },
    
    /**
     * Determines whether or not the provided object is a function
     * @method isFunction
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isFunction: function(o) {
        return typeof o === 'function';
    },
        
    /**
     * Determines whether or not the provided object is null
     * @method isNull
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isNull: function(o) {
        return o === null;
    },
        
    /**
     * Determines whether or not the provided object is a legal number
     * @method isNumber
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isNumber: function(o) {
        return typeof o === 'number' && isFinite(o);
    },
      
    /**
     * Determines whether or not the provided object is of type object
     * or function
     * @method isObject
     * @param {any} o The object being testing
     * @return {boolean} the result
     */  
    isObject: function(o) {
return (o && (typeof o === 'object' || L.isFunction(o))) || false;
    },
        
    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isString: function(o) {
        return typeof o === 'string';
    },
        
    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @param {any} o The object being testing
     * @return {boolean} the result
     */
    isUndefined: function(o) {
        return typeof o === 'undefined';
    },
    
 
    /**
     * IE will not enumerate native functions in a derived object even if the
     * function was overridden.  This is a workaround for specific functions 
     * we care about on the Object prototype. 
     * @property _IEEnumFix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @static
     * @private
     */
    _IEEnumFix: (YAHOO.env.ua.ie) ? function(r, s) {
            for (var i=0;i<ADD.length;i=i+1) {
                var fname=ADD[i],f=s[fname];
                if (L.isFunction(f) && f!=Object.prototype[fname]) {
                    r[fname]=f;
                }
            }
    } : function(){},
       
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass 
     *                              if present.
     */
    extend: function(subc, superc, overrides) {
        if (!superc||!subc) {
            throw new Error("extend failed, please check that " +
                            "all dependencies are included.");
        }
        var F = function() {};
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
    
        if (overrides) {
            for (var i in overrides) {
                if (L.hasOwnProperty(overrides, i)) {
                    subc.prototype[i]=overrides[i];
                }
            }

            L._IEEnumFix(subc.prototype, overrides);
        }
    },
   
    /**
     * Applies all properties in the supplier to the receiver if the
     * receiver does not have these properties yet.  Optionally, one or 
     * more methods/properties can be specified (as additional 
     * parameters).  This option will overwrite the property if receiver 
     * has it already.  If true is passed as the third parameter, all 
     * properties will be applied and _will_ overwrite properties in 
     * the receiver.
     *
     * @method augmentObject
     * @static
     * @since 2.3.0
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  arguments zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything
     *        in the supplier will be used unless it would
     *        overwrite an existing property in the receiver. If true
     *        is specified as the third parameter, all properties will
     *        be applied and will overwrite an existing property in
     *        the receiver
     */
    augmentObject: function(r, s) {
        if (!s||!r) {
            throw new Error("Absorb failed, verify dependencies.");
        }
        var a=arguments, i, p, override=a[2];
        if (override && override!==true) { // only absorb the specified properties
            for (i=2; i<a.length; i=i+1) {
                r[a[i]] = s[a[i]];
            }
        } else { // take everything, overwriting only if the third parameter is true
            for (p in s) { 
                if (override || !(p in r)) {
                    r[p] = s[p];
                }
            }
            
            L._IEEnumFix(r, s);
        }
    },
 
    /**
     * Same as YAHOO.lang.augmentObject, except it only applies prototype properties
     * @see YAHOO.lang.augmentObject
     * @method augmentProto
     * @static
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  arguments zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything 
     *        in the supplier will be used unless it would overwrite an existing 
     *        property in the receiver.  if true is specified as the third 
     *        parameter, all properties will be applied and will overwrite an 
     *        existing property in the receiver
     */
    augmentProto: function(r, s) {
        if (!s||!r) {
            throw new Error("Augment failed, verify dependencies.");
        }
        //var a=[].concat(arguments);
        var a=[r.prototype,s.prototype];
        for (var i=2;i<arguments.length;i=i+1) {
            a.push(arguments[i]);
        }
        L.augmentObject.apply(this, a);
    },

      
    /**
     * Returns a simple string representation of the object or array.
     * Other types of objects will be returned unprocessed.  Arrays
     * are expected to be indexed.  Use object notation for
     * associative arrays.
     * @method dump
     * @since 2.3.0
     * @param o {Object} The object to dump
     * @param d {int} How deep to recurse child objects, default 3
     * @return {String} the dump result
     */
    dump: function(o, d) {
        var i,len,s=[],OBJ="{...}",FUN="f(){...}",
            COMMA=', ', ARROW=' => ';

        // Cast non-objects to string
        // Skip dates because the std toString is what we want
        // Skip HTMLElement-like objects because trying to dump 
        // an element will cause an unhandled exception in FF 2.x
        if (!L.isObject(o)) {
            return o + "";
        } else if (o instanceof Date || ("nodeType" in o && "tagName" in o)) {
            return o;
        } else if  (L.isFunction(o)) {
            return FUN;
        }

        // dig into child objects the depth specifed. Default 3
        d = (L.isNumber(d)) ? d : 3;

        // arrays [1, 2, 3]
        if (L.isArray(o)) {
            s.push("[");
            for (i=0,len=o.length;i<len;i=i+1) {
                if (L.isObject(o[i])) {
                    s.push((d > 0) ? L.dump(o[i], d-1) : OBJ);
                } else {
                    s.push(o[i]);
                }
                s.push(COMMA);
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push("]");
        // objects {k1 => v1, k2 => v2}
        } else {
            s.push("{");
            for (i in o) {
                if (L.hasOwnProperty(o, i)) {
                    s.push(i + ARROW);
                    if (L.isObject(o[i])) {
                        s.push((d > 0) ? L.dump(o[i], d-1) : OBJ);
                    } else {
                        s.push(o[i]);
                    }
                    s.push(COMMA);
                }
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push("}");
        }

        return s.join("");
    },

    /**
     * Does variable substitution on a string. It scans through the string 
     * looking for expressions enclosed in { } braces. If an expression 
     * is found, it is used a key on the object.  If there is a space in
     * the key, the first word is used for the key and the rest is provided
     * to an optional function to be used to programatically determine the
     * value (the extra information might be used for this decision). If 
     * the value for the key in the object, or what is returned from the
     * function has a string value, number value, or object value, it is 
     * substituted for the bracket expression and it repeats.  If this
     * value is an object, it uses the Object's toString() if this has
     * been overridden, otherwise it does a shallow dump of the key/value
     * pairs.
     * @method substitute
     * @since 2.3.0
     * @param s {String} The string that will be modified.
     * @param o {Object} An object containing the replacement values
     * @param f {Function} An optional function that can be used to
     *                     process each match.  It receives the key,
     *                     value, and any extra metadata included with
     *                     the key inside of the braces.
     * @return {String} the substituted string
     */
    substitute: function (s, o, f) {
        var i, j, k, key, v, meta, saved=[], token, 
            DUMP='dump', SPACE=' ', LBRACE='{', RBRACE='}';


        for (;;) {
            i = s.lastIndexOf(LBRACE);
            if (i < 0) {
                break;
            }
            j = s.indexOf(RBRACE, i);
            if (i + 1 >= j) {
                break;
            }

            //Extract key and meta info 
            token = s.substring(i + 1, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k);
            }

            // lookup the value
            v = o[key];

            // if a substitution function was provided, execute it
            if (f) {
                v = f(key, v, meta);
            }

            if (L.isObject(v)) {
                if (L.isArray(v)) {
                    v = L.dump(v, parseInt(meta, 10));
                } else {
                    meta = meta || "";

                    // look for the keyword 'dump', if found force obj dump
                    var dump = meta.indexOf(DUMP);
                    if (dump > -1) {
                        meta = meta.substring(4);
                    }

                    // use the toString if it is not the Object toString 
                    // and the 'dump' meta info was not found
                    if (v.toString===Object.prototype.toString||dump>-1) {
                        v = L.dump(v, parseInt(meta, 10));
                    } else {
                        v = v.toString();
                    }
                }
            } else if (!L.isString(v) && !L.isNumber(v)) {
                // This {block} has no replace string. Save it for later.
                v = "~-" + saved.length + "-~";
                saved[saved.length] = token;

                // break;
            }

            s = s.substring(0, i) + v + s.substring(j + 1);


        }

        // restore saved {block}s
        for (i=saved.length-1; i>=0; i=i-1) {
            s = s.replace(new RegExp("~-" + i + "-~"), "{"  + saved[i] + "}", "g");
        }

        return s;
    },


    /**
     * Returns a string without any leading or trailing whitespace.  If 
     * the input is not a string, the input will be returned untouched.
     * @method trim
     * @since 2.3.0
     * @param s {string} the string to trim
     * @return {string} the trimmed string
     */
    trim: function(s){
        try {
            return s.replace(/^\s+|\s+$/g, "");
        } catch(e) {
            return s;
        }
    },

    /**
     * Returns a new object containing all of the properties of
     * all the supplied objects.  The properties from later objects
     * will overwrite those in earlier objects.
     * @method merge
     * @since 2.3.0
     * @param arguments {Object*} the objects to merge
     * @return the new merged object
     */
    merge: function() {
        var o={}, a=arguments;
        for (var i=0, l=a.length; i<l; i=i+1) {
            L.augmentObject(o, a[i], true);
        }
        return o;
    },

    /**
     * Executes the supplied function in the context of the supplied 
     * object 'when' milliseconds later.  Executes the function a 
     * single time unless periodic is set to true.
     * @method later
     * @since 2.4.0
     * @param when {int} the number of milliseconds to wait until the fn 
     * is executed
     * @param o the context object
     * @param fn {Function|String} the function to execute or the name of 
     * the method in the 'o' object to execute
     * @param data [Array] data that is provided to the function.  This accepts
     * either a single item or an array.  If an array is provided, the
     * function is executed with one parameter for each array item.  If
     * you need to pass a single array parameter, it needs to be wrapped in
     * an array [myarray]
     * @param periodic {boolean} if true, executes continuously at supplied 
     * interval until canceled
     * @return a timer object. Call the cancel() method on this object to 
     * stop the timer.
     */
    later: function(when, o, fn, data, periodic) {
        when = when || 0; 
        o = o || {};
        var m=fn, d=data, f, r;

        if (L.isString(fn)) {
            m = o[fn];
        }

        if (!m) {
            throw new TypeError("method undefined");
        }

        if (!L.isArray(d)) {
            d = [data];
        }

        f = function() {
            m.apply(o, d);
        };

        r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

        return {
            interval: periodic,
            cancel: function() {
                if (this.interval) {
                    clearInterval(r);
                } else {
                    clearTimeout(r);
                }
            }
        };
    },
    
    /**
     * A convenience method for detecting a legitimate non-null value.
     * Returns false for null/undefined/NaN, true for other values, 
     * including 0/false/''
     * @method isValue
     * @since 2.3.0
     * @param o {any} the item to test
     * @return {boolean} true if it is not null/undefined/NaN || false
     */
    isValue: function(o) {
        // return (o || o === false || o === 0 || o === ''); // Infinity fails
return (L.isObject(o) || L.isString(o) || L.isNumber(o) || L.isBoolean(o));
    }

};

/**
 * Determines whether or not the property was added
 * to the object instance.  Returns false if the property is not present
 * in the object, or was inherited from the prototype.
 * This abstraction is provided to enable hasOwnProperty for Safari 1.3.x.
 * There is a discrepancy between YAHOO.lang.hasOwnProperty and
 * Object.prototype.hasOwnProperty when the property is a primitive added to
 * both the instance AND prototype with the same value:
 * <pre>
 * var A = function() {};
 * A.prototype.foo = 'foo';
 * var a = new A();
 * a.foo = 'foo';
 * alert(a.hasOwnProperty('foo')); // true
 * alert(YAHOO.lang.hasOwnProperty(a, 'foo')); // false when using fallback
 * </pre>
 * @method hasOwnProperty
 * @param {any} o The object being testing
 * @param prop {string} the name of the property to test
 * @return {boolean} the result
 */
L.hasOwnProperty = (Object.prototype.hasOwnProperty) ?
    function(o, prop) {
        return o && o.hasOwnProperty(prop);
    } : function(o, prop) {
        return !L.isUndefined(o[prop]) && 
                o.constructor.prototype[prop] !== o[prop];
    };

// new lang wins
OB.augmentObject(L, OB, true);

/*
 * An alias for <a href="YAHOO.lang.html">YAHOO.lang</a>
 * @class YAHOO.util.Lang
 */
YAHOO.util.Lang = L;
 
/**
 * Same as YAHOO.lang.augmentObject, except it only applies prototype 
 * properties.  This is an alias for augmentProto.
 * @see YAHOO.lang.augmentObject
 * @method augment
 * @static
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @param {String*|boolean}  arguments zero or more properties methods to 
 *        augment the receiver with.  If none specified, everything
 *        in the supplier will be used unless it would
 *        overwrite an existing property in the receiver.  if true
 *        is specified as the third parameter, all properties will
 *        be applied and will overwrite an existing property in
 *        the receiver
 */
L.augment = L.augmentProto;

/**
 * An alias for <a href="YAHOO.lang.html#augment">YAHOO.lang.augment</a>
 * @for YAHOO
 * @method augment
 * @static
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @param {String*}  arguments zero or more properties methods to 
 *        augment the receiver with.  If none specified, everything
 *        in the supplier will be used unless it would
 *        overwrite an existing property in the receiver
 */
YAHOO.augment = L.augmentProto;
       
/**
 * An alias for <a href="YAHOO.lang.html#extend">YAHOO.lang.extend</a>
 * @method extend
 * @static
 * @param {Function} subc   the object to modify
 * @param {Function} superc the object to inherit
 * @param {Object} overrides  additional properties/methods to add to the
 *        subclass prototype.  These will override the
 *        matching items obtained from the superclass if present.
 */
YAHOO.extend = L.extend;

})();
YAHOO.register("yahoo", YAHOO, {version: "2.5.2", build: "1076"});
}
/*
 * =head1 NAME
 *
 * b9j - A JavaScript toolkit
 *
 * =head1 VERSION
 *
 * Version 0.1.9
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
 * [b9j.pguid](http://appengine.bravo9.com/b9j/documentation/pguid.html) - Page-unique identifier generation
 *
 * =head2 b9j.namespace - Namespace creation and aliasing
 *
 *          namespace.declare              # Declare a namespace
 *          namespace.using                # Alias one or more namespace(s) to a shorthand name
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/namespace.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/namespace.html)
 *
 * =head2 b9j.test - A wrapper around YUI Test to make simple testing easy
 *
 *          test.b9jTest                   # An easy-to-use test framework based on YUI Test
 *                                         # NOTE: Requires YUI Test to be loaded
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/test.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/test.html)
 *
 * =head2 b9jTest - A bundled version of b9j.test
 *
 *          b9jTest                        # An easy-to-use test framework based on YUI Test
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/b9jTest.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/b9jTest.html)
 *
 * =head2 b9j.path - UNIX-style path parsing, manipulation, and generation
 *
 *          path.Path                      # A class representing a URI/UNIX-style path
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/path.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/path.html)
 *
 * =head2 b9j.uri - URI (Uniform Resource Identifier) parsing, manipulation, and generation
 *
 *          uri.URI                        # A class representing a URI
 *          uri.parse                      # Parse a URI string
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/uri.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/uri.html)
 *
 * =head2 b9j.uri.query - URI query parsing, manipulation, and generation
 *
 *          uri.query.Query                # A class representing a URI query
 *          uri.query.parse                # Parse a URI query string
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/uri.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/uri.html)
 *
 * =head2 b9j.digest.sha256 - A SHA-256 digester
 *
 *          digest.sha256.calculate16      # Calculate a hexadecimal (base 16) SHA-256 digest
 *          digest.sha256.calculate64      # Calculate a base64 SHA-256 digest
 *          digest.sha256.calculate        # Calculate a binary-string (base 256) SHA-256 digest
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/digest.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/digest.html)
 *
 * =head2 b9j.random - Generate pseudo-random binary, hexadecimal, or base64 data of arbritrary length
 *
 *          random.generate16              # Generate a pseudo-random hexadecimal (base 16) value
 *          random.generate64              # Generate a pseudo-random base64 value
 *          random.generate                # Generate a pseudo-random binary string (base 256)
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/random.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/random.html)
 *
 * =head2 b9j.pguid - Page-unique identifier generation
 *
 *          pguid.next                      # Generate a stock pguid
 *          pguid.assign                    # Given an element, generate and assign the next
 *                                          # stock pguid (unless the element already has one)
 *          pguid.Sequence                  # A pguid-generator class
 *
 * [&raquo; Documentation](http://appengine.bravo9.com/b9j/documentation/pguid.html) | [&raquo; Test](http://appengine.bravo9.com/b9j/test/pguid.html)
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
    if (! window.b9j) // Syntax checking hack
        window.b9j = b9j
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
                    var ii_value = copy[ii];
                    if (b9j.isObject(ii_value))
                        copy[ii] = clone(ii_value, given);
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
                        var ii_value = copy[ii];
                        if (b9j.isArray(ii_value))
                            copy[ii] = clone(ii_value, given);
                    }
                }
            }
            else {
                for (ii in copy) {
                    if (copy.hasOwnProperty(ii)) {
                        var ii_value = copy[ii];
                        if (b9j.isObject(ii_value))
                            copy[ii] = clone(ii_value, given);
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
/* 
 * =head1 NAME
 * 
 * b9j.namespace - Namespace creation and aliasing
 *
 * =head1 SYNPOSIS 
 *  
 *          var declare = b9j.namespace.declare; 
 *          var using = b9j.namespace.using;
 *
 *          declare("YAHOO.util");
 *
 *          declare({ com: {
 *            example:
 *                [ 'apple', 'banana', 'cherry.grape' ] }
 *          });
 *
 *          using(com.example.apple,
 *              com.example.cherry.grape).run(function(apple, grape){
 *
 *                  apple.xyzzy();
 *                  ...
 *                  grape.frobozz();
 *                  ...
 *          })
 *
 * =head1 DESCRIPTION
 *  
 * b9j.namespace provides methods for setting up and using namespaces
 *
 * The methods contained within are modeled after:  
 * [http://blog.higher-order.net/2008/02/18/designing-clientserver-web-applications/](http://blog.higher-order.net/2008/02/18/designing-clientserver-web-applications/) (by Karl Krukow)
 *
 * =head1 METHODS
 *
 * =head2 b9j.namespace.declare( $namespace, [ $context ] )
 *
 * Create $namespace under $context
 *
 * If $context is not given, then it will default to window
 *
 * $namespace can be any of:
 *
 *      string          # $namespace should be in a dotted path form, as in
 *                      # "YAHOO.lang" or "b9j.namespace" or "com.example.xyzzy"
 *                      # The endpoint namespace (object) will be created, along with each
 *                      # namespace encountered along the way (if it doesn't already exist)
 *
 *      array           # For each element in the array, declare a namespace using that element
 *                      # and $context. Essentially does this:
 *
 *                          b9j.namespace.declare($namespace[0], $context);
 *                          b9j.namespace.declare($namespace[1], $context);
 *                          ...
 *
 *      hash (object)   # For each key in the hash, create a namespace in $context under
 *                      # the key, then recursively declare a new namespace with the value
 *                      # in the hash and $context[key]. For example:
 *
 *                          b9j.namespace.declare({ com: {
 *                              example:
 *                                  [ 'apple', 'banana', 'cherry.grape' ] }
 *                          });
 *
 *                      # The above will create:
 *                          
 *                          com
 *                          com.example
 *                          com.example.apple
 *                          com.example.banana
 *                          com.example.cherry
 *                          com.example.cherry.grape
 *
 * =head2 b9j.namespace.using( $namespace1, $namespace2, ... )
 *
 * Returns an object with a single method called run. By passing a function
 * to run with place arguments corresponding to $namespace1, $namespace2, ..., you
 * can alias a long namespace identifier to a short one. For example:
 *
 *          b9j.namespace.using(com.example.apple,
 *              com.example.cherry.grape).run(function(apple, grape){
 *
 *                  apple.xyzzy();
 *                  ...
 *                  grape.frobozz();
 *                  ...
 *          })
 *
 * =head1 SEE ALSO
 *
 * [http://blog.higher-order.net/2008/02/18/designing-clientserver-web-applications/](http://blog.higher-order.net/2008/02/18/designing-clientserver-web-applications/)
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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

(function(){

    // 'use' adapted from work by Karl Krukow
    // http://blog.higher-order.net/2008/02/18/designing-clientserver-web-applications/

    var pckg = b9j._namespace('b9j.namespace');

    pckg.using = function() {
        var arguments_ = arguments;
        return {
            run: function(user) {
                return user.apply(arguments_[0], arguments_);
            }
         };
    };

    pckg.namespaceRE = b9j._namespaceRE;
    pckg.namespace = b9j._namespace;
    pckg.declare = b9j._namespace;

}());
/* 
 * =head1 NAME
 * 
 * b9j.test - A wrapper around YUI Test to make simple testing easy
 *
 * =head1 SYNPOSIS 
 *  
 *     b9j.test.b9jTest(function(test) {
 *
 *         test.is("xyzzy", "xyzzy");
 *         test.like(/this/, "that");
 *         test.isSTring("frobozz");
 *
 *     });
 *  
 * =head1 DESCRIPTION
 *  
 * b9j.test is a wrapper around [YUI Test](http://developer.yahoo.com/yui/yuitest/), providing [Test::More](http://search.cpan.org/perldoc?Test::More)-like functionality and feedback
 *  
 * Primarily, b9j.test provides the b9jTest method, described below.
 *
 * =head2 NOTE: This package requires YUI Test to be loaded. For a standalone solution, see the b9jTest package
 *
 * =head1 Example HTML test document
 *
 * The following is a functioning example of b9j.test.b9jTest in action:
 *
 *         <html>
 *         <head>
 *             <meta http-equiv="content-type" content="text/html; charset=utf-8">
 *         <title>Test example</title>
 *         <link rel="stylesheet" type="text/css" href="http://appengine.bravo9.com/b9j/b9jTest.css">
 *         <script type="text/javascript" src="http://appengine.bravo9.com/b9j/b9jTest.js"></script>
 *         </head>
 *         <body class="yui-skin-sam">
 *         <div id="testLogger"></div>
 *         <script type="text/javascript">
 *         
 *             b9j.test.b9jTest(function(test) {
 *                 test.areEqual("xyzzy", "xyzzy");
 *                 test.areEqual("apple", "apple");
 *                 test.like(/banana/, "banana");
 *             });
 *         
 *         </script>
 *         </body>
 *         </html>
 *
 * =head1 METHODS
 *
 * =head2 b9j.test.b9jTest( $function )
 *
 * Run the given $function with a tester object as the first argument
 *
 *         b9j.test.b9jTest(function(test) {
 *
 *             test.areEqual( ... )
 *             ...
 *
 *         });
 * 
 * In order to report test results, b9jTest expects to be run in an HTML document that includes an
 * element with the id of "testLogger" wrapped in the "yui-skin-sam" CSS skin:
 *
 *         <body class="yui-skin-sam">
 *         <div id="testLogger"></div>
 *         <script type="text/javascript">
 *         
 *             b9j.test.b9jTest(function(test) {
 *                  ...
 *             });
 *
 *         </script>
 *         </body>
 *
 * =head1 Test functions
 *
 * The following test functions are available on passed in tester object.
 *
 * Most of these are wrappers around functions found in the [YAHOO.util.Assert](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html) package. A
 * detailed description of their workings can be found at: [http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html)
 *
 * =head2 areEqual( $want, $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.areEqual](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_areEqual)
 *
 * =head2 is( $want, $have, [ $message ] )
 *
 * An alias for areEqual
 *
 * =head2 areNotEqual( $want, $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.areNotEqual](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_areNotEqual)
 *
 * =head2 isnt( $want, $have, [ $message ] )
 *
 * An alias for areNotEqual
 *
 * =head2 like( $re, $value, [ $message ] )
 *
 * The test passes if $value matches $re (which is a regular expression)
 *
 *          test.like(/xyzzy/, "applexyzzy")
 *
 * =head2 unlike( $re, $value, [ $message ] )
 *
 * The test passes if $value does NOT match $re (which is a regular expression)
 *
 *          test.unlike(/xyzzy/, "banana")
 *
 * =head2 areSame( $want, $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.areSame](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_areSame)
 *
 * =head2 areNotSame( $want, $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.areNotSame](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_areNotSame)
 *
 * =head2 fail( [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.fail](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_fail)
 *
 * =head2 isTypeOf( $wantType, $value, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isTypeOf](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isTypeOf)
 *
 * =head2 isArray( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isArray](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isArray)
 *
 * =head2 isBoolean( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isBoolean](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isBoolean)
 *
 * =head2 isFunction( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isFunction](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isFunction)
 *
 * =head2 isNumber( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isNumber](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isNumber)
 *
 * =head2 isOjbect( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isObject](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isObject)
 *
 * =head2 isString( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isString](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isString)
 *
 * =head2 isTrue( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isTrue](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isTrue)
 *
 * =head2 isFalse( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isFalse](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isFalse)
 *
 * =head2 isNaN( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isNaN](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isNaN)
 *
 * =head2 isNotNaN( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isNotNaN](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isNotNaN)
 *
 * =head2 isNull( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isNull](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isNull)
 *
 * =head2 isNotNull( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isNotNull](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isNotNull)
 *
 * =head2 isUndefined( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isUndefined](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isUndefined)
 *
 * =head2 isNotUndefined( $have, [ $message ] )
 *
 * &raquo; [YAHOO.util.Assert.isNotUndefined](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html#method_isNotUndefined)
 *
 * =head1 SEE ALSO
 *
 * [YUI Test](http://developer.yahoo.com/yui/yuitest/)
 *
 * [JS-Test-Simple](http://search.cpan.org/dist/JS-Test-Simple/lib/JS/Test/Simple.pod)
 *
 * [JSUnit](http://www.edwardh.com/jsunit/)
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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

(function(){

    var pckg = b9j.namespace.declare('b9j.test');

    pckg.b9jTest = function(testCode, onCompleteCode) {

        var Yl = YAHOO.lang;
        var Yu = YAHOO.util;
        var YuA = YAHOO.util.Assert;
        var TestRunner = YAHOO.tool.TestRunner;

        YAHOO.util.Event.onDOMReady(function(){

            var logger = new YAHOO.tool.TestLogger("testLogger", { thresholdMin: 1000, thresholdMax: 1000 });
            logger.collapse();

            var name, setUp, tearDown;
            name = "b9jTest";
            
            var tester = new b9j.test.Tester();
            tester._informer();

            TestRunner.add(new YAHOO.tool.TestCase({

                name: name,

                testTest: function() {
                    var error;
                    tester._beginTesting(this);
                    try {
                        testCode(tester);
                    }
                    catch (thrown) {
                        tester.fail(thrown + "");
                        logger.expand();
                        error = thrown;
                    }
                    tester._endTesting(this);
                    if (error)
                        throw error;
                }

            }));    

            if (onCompleteCode) {
                TestRunner.subscribe(TestRunner.COMPLETE_EVENT, function (result) {
                    onCompleteCode(tester._report(), result);
                });
            }

//            TestRunner.subscribe(TestRunner.COMPLETE_EVENT, function (result) {
//                b9j.browsersmoke._TestRunner_COMPLETE_EVENT(tester._report(), result);
//            });

            TestRunner.run();

        });
    };

    pckg.Tester = function(given) {
        if (! pckg._built_Tester) pckg._build_Tester()

        if (! given) given = {}; 
        this._errors = [];
        this._tests = 0;
        this._test = 0;
    };

    pckg.Tester.prototype = {
        _beginTest: function() {
            this._tests += 1;
            this._test = this._tests;
        },

        _endTest: function(error) {
            if (error) {
                this._errors.push({ test: this._test, error: error });
                this._fail("fail " + this._test + ":\n" + error);
            }
            else {
                
                this._pass("pass " + this._test);
            }
        },

        _pass: function(message) {
            this._inform(message);
        },

        _fail: function(message) {
            this._inform("<span class=\"fail\">" + message + "</span>", message);
        },

        _summary: function(message) {
            if (this._errors.length) {
                this._fail(message);
            }
            else {
                this._inform("<span class=\"pass\">" + message + "</span>", message);
            }
        },

        _beginTesting: function() {
            this._benchmarkStartDateTime = new Date();
        },

        _endTesting: function(testCase) {
            this._benchmarkStopDateTime = new Date();
            this._benchmarkTime = this._benchmarkStopDateTime - this._benchmarkStartDateTime;
        

            var total = this._tests;
            var passed = total - this._errors.length;
            var failed = this._errors.length;
            var fail = failed > 0 ? true : false;

            this._summary(testCase.name + ": " + "Passed:" + passed + " Failed:" + failed + " Total:" + total + "\n" +
                   "Failed " + failed + "/" + total + ", " + (passed/total).toFixed(2) * 100 + "% okay");

            if (fail) {
                this._skipLogger = true; // Yuck!
                for (ii = 0; ii < this._errors.length; ++ii) {
                    this._inform("---");
                    var error = this._errors[ii];
                    this._fail("test " + error.test + ":\n" + error.error);
                }
            }

            document.body.scrollTop = document.body.scrollHeight;

            if (this._errors.length)
                YAHOO.util.Assert.fail("FAIL " + this._errors.length + " / " + this._tests);
        },

        _inform: function(message, loggerMessage) {
            if (! this._skipLogger) {
                if (! loggerMessage)
                    loggerMessage = message;
                YAHOO.log(loggerMessage, "info", "TestRunner");
            }
            this._informer().innerHTML += message + "\n";
        },

        _informer: function() {
            if (this.informer)
                return this.informer;
            var informer = $("#testInformer").get(0);
            if (! informer) {
                $(document.body).append("<pre style=\"float: left; text-align: left;\" id=\"testInformer\"></pre>");
            }
            return this.informer = $("#testInformer").get(0);
        },

        _report: function() {
            var total = this._tests;
            var pass = total - this._errors.length;
            var fail = this._errors.length;
            var failed = this._errors;

            return {
                total: total,
                pass: pass,
                fail: fail,
                failed: failed,
                benchmark_start_datetime: this._benchmarkStartDateTime.toUTCString(),
                benchmark_stop_datetime: this._benchmarkStopDateTime.toUTCString(),
                benchmark_time: this._benchmarkTime
             };
        }

    };

    pckg._build_Tester = function() {

        var Yl = YAHOO.lang;
        var Yu = YAHOO.util;
        var YuA = YAHOO.util.Assert;
        var TestRunner = YAHOO.tool.TestRunner;

        var assertionToTest = function(test)  {
            return function() {
                this._beginTest();
                var error;
                try {
                    test.apply(YuA, arguments);
                }
                catch (thrown) {
                    if (! thrown instanceof YAHOO.util.AssertionError)
                        throw (thrown);
                    error = thrown;
                }
                this._endTest(error);
                return error ? false : true;
            };
        }

        var _test = [
                'areEqual',
                'areNotEqual',
                'areSame',
                'areNotSame',
                'fail',
                'isTypeOf',
                'isArray',
                'isBoolean',
                'isFunction',
                'isNumber',
                'isObject',
                'isString',
                'isInstanceOf',
                'isTrue',
                'isFalse',
                'isNaN',
                'isNotNaN',
                'isNull',
                'isNotNull',
                'isUndefined',
                'isNotUndefined'
            ];

        for (ii = 0; ii < _test.length; ii++) {
            var name = _test[ii];
            pckg.Tester.prototype[name] = assertionToTest(YAHOO.util.Assert[name]);
        }

        pckg.Tester.prototype.like = assertionToTest(function(match, value, message) {
            if (Yl.isString(match)) {
                match = new RegExp(match);
            }
            if (! Yl.isValue(value) || ! Yl.isString(value) || ! value.match(match)) {
                throw new Yu.ComparisonFailure(YuA._formatMessage(message, "Value does not match regular expression"), match, value);
            }
        });

        pckg.Tester.prototype.unlike = assertionToTest(function(match, value, message) {
            if (Yl.isString(match)) {
                match = new RegExp(match);
            }
            if (! Yl.isValue(value) || ! Yl.isString(value) || ! value.match(match)) {
                return;
            }
            throw new Yu.UnexpectedValue(YuA._formatMessage(message, "Value should not match regular expression"), match, value);
        });

        pckg.Tester.prototype.is = pckg.Tester.prototype.areEqual;

        pckg.Tester.prototype.isnt = pckg.Tester.prototype.areNotEqual;
    }

}());
/* 
 * =head1 NAME
 * 
 * b9j.browsersmoke -
 *
 * =head1 SYNPOSIS 
 *  
 * =head1 DESCRIPTION
 *  
 * =head1 METHODS
 *
 * =head1 SEE ALSO
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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

(function(){

    var pckg = b9j.namespace.declare('b9j.browsersmoke');

    pckg.report = function(given) {

        var report = {};

        var reporter = b9j.environment.detect();
        for (key in reporter) {
            report["reporter_" + key] = reporter[key];
        }

        report.location = window.location.href;

        var to;
        to = "http://localhost:8080/api/test/report/submit/";
        to = "http://browsersmoke.appspot.com/api/test/report/submit/";
        to += "chunker";
        report.to = to;

        if (given.test) {
            if (b9j.isFunction(given.test)) { // given.test = function() ...
                try {
                    gotten = given.test(report);
                    if (gotten)
                        report = b9j.merge(report, gotten)
                }
                catch (thrown) {
                    report.result = "unknown";
                }
            }
            else {
                throw "b9j.browsersmoke.report: Don't understand .test " + given.test;
            }
            delete given.test;
        }
        else if (given.b9jTest) {
            var b9jTest = given.b9jTest;
            delete given.b9jTest;
            if (b9j.isFunction(b9jTest)) { // given.b9jTest = function() ...
                try {
                    b9j.test.b9jTest(b9jTest, function (b9jTestReport){
                        report = b9j.merge(report, b9jTestReport)
                        delete report.fail;
                        delete report.failed;
                        report.total = b9jTestReport.total;
                        var fail = [];
                        if (b9jTestReport.fail) {
                            var failed = b9jTestReport.failed;
                            for (var ii = 0; ii < failed.length; ii++) {
                                var failure = b9j.clone(failed[ii], { shallow: 1 });
                                failure.error = failure.error + "";
                                fail.push(failure);
                            }
                            report.fail = fail;
                        }
                        else {
                            report.fail = 0;
                        }
                        pckg.submitReport(given, report);
                    });
                    return;
                }
                catch (thrown) {
                    report.result = "unknown";
                    pckg.submitReport(given, report);
                }
            }
            else {
                throw "b9j.browsersmoke.report: Don't understand .b9jTest " + b9jTest;
            }
        }

        pckg.submitReport(given, report);

//        if (b9j.isString(report_)) { // report_ = ~...
//            report.test = report_
//        }
//        else if (b9j.isFunction(report_)) { // report_ = function() ...
//            var gotten = report_(report);
//            if (gotten)
//                report = gotten;
//        }
//        else if (b9j.isObject(report_)) { // report_ = { ... }
//            report = b9j.merge(report, report_)
//        }
//        else {
//            throw "b9j.browsersmoke.report: Don't understand report " + report_;
//        }

    };

    pckg.submitReport = function(given, report) {

        var filter = given.filter;
        delete given.filter;

        report = b9j.merge(report, given)

//        if (console)
//            console.log(report);

        if (filter) {
            if (b9j.isFunction(filter)) { // filter = function() ...
                var gotten = filter(report);
                if (gotten)
                    report = gotten;
            }
            else {
                throw "b9j.browsersmoke.report: Don't understand filter " + filter;
            }
        }

        var to = report.to;
        delete report.to;

        if (b9j.isFunction(to))
            to(report);
        else
            b9j.chunker.send(to, report);
    };


//    pckg._TestRunner_COMPLETE_EVENT = function(report_) {
//        var uri = b9j.uri.location();
//        if (uri.query().get().b9jSmoke) {
//            b9j.browsersmoke.report(report_);
//        }
//    };

}());
/* 
 * =head1 NAME
 * 
 * b9j.path - UNIX-style path parsing, manipulation, and generation
 *
 * =head1 SYNOPSIS 
 *  
 *      var path = new b9j.path.Path("/a/b/c")
 *
 *      // /a/b/c/xyzzy
 *      var child = path.child("xyzzy")
 *
 *      // /a/b
 *      var parent = path.parent()
 *
 * =head1 DESCRIPTION
 *
 * This package provides a way to parse, manipulate, and generate UNIX-style paths.
 * 
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.path');

    function canonical_string() {
        return b9j.path._canonical.apply(b9j.path, arguments);
    }

    function canonical_array() {
        return canonical_string.apply(this, arguments).split('/');
    }

    function _flatten(array, value) {
        if ("string" == typeof value) {
            array.push(value);
        }
        else if ("number" == typeof value) {
            array.push(value);
        }
        else if ("object" == typeof value) {
//            if ("function" == typeof value.get) { // We probably have a Path object
//                array.push(value.get());
//            }
            if (undefined != value.length) { // Assume an array
                for (var ii = 0; ii < value.length; ii++) {
                    _flatten(array, value[ii]);
                }
            }
            else {
                array.push("" + value);
            }
        }
        else {
            array.push("" + value);
        }
    }

    /*
        $path =~ s|/{2,}|/|g;                           # xx////xx  -> xx/xx
        $path =~ s{(?:/\.)+(?:/|\z)}{/}g;               # xx/././xx -> xx/xx
        $path =~ s|^(?:\./)+||s unless $path eq "./";	# ./xx      -> xx
        $path =~ s|^/(?:\.\./)+|/|;			            # /../../xx -> /xx
        $path =~ s|^/\.\.$|/|;				            # /..       -> /
        $path =~ s|/\z|| unless $path eq "/";		    # xx/       -> xx
    */

    pckg._canonical = function() {
        var path = [];
        _flatten(path, arguments);
        path = path.join('/').split(/\/+/).join('/');       // xx////xx     -> xx/xx
        path = path.replace(/(?:\/\.)+(?:\/|$)/g, '/');     // xx/././xx    -> xx/xx
        if ("./" != path)
            path = path.replace(/^(?:\.\/)+/, '');          // ./xx         -> xx
        path = path.replace(/^\/(?:\.\.\/)+/, '/');         // /../../xx    -> /xx
        path = path.replace(/^\/\.\.$/, '/');               // /..          -> /
        return path;
    };

/*
 * =head1 METHODS
 *
 * =head2 new b9j.path.Path( )
 *
 * Returns a new object representing the empty path
 *
 * =head2 new b9j.path.Path( $part1, [ $part2, ... ] )
 *
 * Returns a new object representing a path formed by joining $partN together with '/'
 *
 *          var path = b9j.path.Path( "a/b", "c", "d//e/f/" ) // a/b/c/d/e/f/
 *
 */

    pckg.Path = function() {
        this.set.apply(this, arguments);
    };

    pckg.Path.prototype = {

/*
 * =head2 path.clone()
 *
 * Returns a clone of path
 *
 */
        clone: function() {
            return new b9j.path.Path(this.get());
        },

/*
 * =head2 path.set( $path )
 *
 * =head2 path.set( $part1, $part2, ...  )
 *
 * Set the path to a cleaned-up version of the arguments
 *
 *          path.set( "////a", "b/c" ) // /a/b/c
 *
 */
        set: function() {
            this._path = canonical_array(arguments);
            if (this._path.length > 1 && this._path[0] == "") {
                this._root = true;
                if (2 == this._path.length && this._path[1] == "") { /* Dealing with [ "", "" ] case */
                    this._path = [ "" ];
                }
            }
            return this;
        },

/*
 * =head2 path.toString()
 *
 * =head2 path.get() 
 *
 * Return a string representing path
 *
 */
        get: function() {
            return this.toString();
        },

        toString: function() {
            if (this._path.length == 1 && "" == this._path[0]) // Might be at "/"
                return this._root ? '/' : '';
            return this._path.join('/');
        },

/*
 * =head2 path.pop( [ $count ] )
 *
 * Pop $count parts (a part is what is between slashes) off the end of path
 *
 * If $count is not specified, then it defaults to 1
 *
 * Returns a b9j.path.Path object representing the popped parts
 *
 *          var path = new b9j.path.Path( "a/b/c/d/e/f/g" )
 *          var popped_path = path.pop(3)
 *          // path is a/b/c/d
 *          // popped_path is e/f/g
 *
 */
        pop: function() {
            var popped = [];
            var count = arguments.length ? arguments[0] : 1;
        
            if (this.isEmpty()) return new b9j.path.Path();
            if (this.isRoot()) return new b9j.path.Path();

            if (count > 0 && this._path.length > 1 && "" == this._path[this._path.length - 1]) // Get rid of "extra" slash at end: a/b/c/
                this._path.pop();

            while (count-- && this._path.length) {
                if (this._path.length == 1 && "" == this._path[0]) // Preserve "/"
                    break;
                popped.push(this._path.pop());
            }

            return new b9j.path.Path(popped);
        },

/*
 * =head2 path.up( [ $count ] )
 *
 * Behaves similarly to path.pop, in that it takes off $count parts from the end
 * of the path. However, path.up returns path, so you can use it for chaining:
 *
 *          var path = new b9j.path.Path( "a/b/c/d/e/f/g" )
 *          path.up().up(2).toString() // a/b/c/d
 *
 */          
        up: function() {
            this.pop.apply(this, arguments);
            return this;
        },

/*
 * =head2 path.parent()
 *
 * Returns the parent path of path as a new, separate b9j.path.Path object
 *
 *          var path = new b9j.path.Path( "a/b/c" )
 *          var parent_path = path.parent()
 *          // path is STILL a/b/c
 *          // parent_path is a/b
 *
 */
        parent: function() {
            var path = this.clone();
            path.pop.apply(this, arguments);
            return path;
        },

/*
 * =head2 path.push( $part1, [ $part2 ], ... )
 *
 * =head2 path.down( $part1, [ $part2 ], ... )
 *
 * Modifies path by appending $part1, $part2, to path separated by slashes
 *
 * Returns path so you can use it for chaining:
 *
 *          var path = new b9j.path.Path( "a/b/c" )
 *          path.down( "d//e", "f" ).down( "g" ) // "a/b/c/d/e/f/g
 *
 */

        push: function() {
            this._path = canonical_array(this._path, arguments);
            return this;
        },

        down: function() {
            this.push.apply(this, arguments);
            return this;
        },

/*
 * =head2 path.child( $part1, [ $part2 ], ... )
 *
 * Returns a child path of path as a new, separate b9j.path.Path object with $partN appended
 * (separated by slashes)
 *
 *          var path = new b9j.path.Path( "a/b/c" )
 *          var child_path = path.child( "d/e" )
 *          // path is STILL a/b/c
 *          // child_path is a/b/c/d/e
 *
 */
        child: function() {
            var path = this.clone();
            path.push.apply(this, arguments);
            return path;
        },

/*
 * =head2 path.append( $part1, [ $part2 ], ... )
 *
 * Modify path by appending $part1 WITHOUT separating it by a slash. Any, optional,
 * following $part2, ..., will be separated by slashes as normal
 *
 *          var path = new b9j.path.Path( "a/b/c" )
 *          path.append( "d", "ef/g", "h" ) // "a/b/cd/ef/g/h"
 *
 */

        append: function() {
            if (! arguments.length)
                return this;
            var arguments_ = Array.prototype.slice.call(arguments);
            this.set(this.toString() + arguments_.join("/"));
            return this
        },

/*
 * =head2 path.extension()
 *
 * Returns the extension of path, including the leading the dot
 *
 * Returns "" if path does not have an extension
 *
 *          new b9j.path.Path( "a/b/c.html" ).extension() // .html
 *          new b9j.path.Path( "a/b/c" ).extension() // ""
 *          new b9j.path.Path( "a/b/c.tar.gz" ).extension() // .gz
 *          new b9j.path.Path( "a/b/c.tar.gz" ).extension({ match: "*" }) // .tar.gz
 *
 * =head2 path.extension( $extension )
 *
 * Modify path by changing the existing extension of path, if any, to $extension
 *
 *          new b9j.path.Path( "a/b/c.html" ).extension( ".txt" ) // a/b/c.txt
 *          new b9j.path.Path( "a/b/c.html" ).extension( "zip" ) // a/b/c.zip
 *          new b9j.path.Path( "a/b/c.html" ).extension( "" ) // a/b/c
 *
 * Returns path
 *
 */
        extension: function(extension, $options) {
            if (arguments.length == 1 && "object" == typeof extension) {
                $options = extension;
                extension = null;
            }
            else if (arguments.length) {
                if (null == extension)
                    extension = "";
            }

            if (!$options)
                $options = {};
            else {
                if (b9j.isFunction($options.exec)) { // $options is a RegExp object
                    $options = { match: $options }
                }
                else if ("object" == typeof $options) {
                }
                else {
                    $options = { match: $options }
                }
            }

            var matcher = $options.match || 1;
            if ("*" == matcher)
                matcher = "";
            if ("" == matcher || "number" == typeof matcher) {
                
                matcher = new RegExp("(\\.[^\\.]+){1," + matcher + "}$", "g");
//                var _matcher = ""
//                while (matcher--)
//                    _matcher += "(\\.[^\\.]+)?"
//                matcher = new RegExp(_matcher + "$", "g");
            }
            else if ("string" == typeof matcher) {
                matcher = new RegExp(matcher);
            }

            var ending = this.ending();

            if (null == extension) {
                if (this.isEmpty() || this.isRoot())
                    return "";
                var match = matcher.exec(ending);
                if (! match) 
                    return "";
                return match[0];
            }
            else {
                if ("" == extension)
                    ;
                else if (extension[0] != ".")
                    extension = "." + extension

                if (this.isEmpty() || this.isRoot())
                    this.append(extension);
                else {
                    if (matcher.test(ending)) {
                        ending = ending.replace(matcher, extension);
                        this.pop();
                        this.push(ending);
                    }
                    else {
                        this.append(extension);
                    }
                }
                return this;
            }
        },

/* 
 * =head2 path.isEmpty()
 *
 * Returns true if path is the empty path ("")
 *
 *          new b9j.path.Path().isEmpty()     // true
 *          new b9j.path.Path("").isEmpty()   // true
 *          new b9j.path.Path("/").isEmpty()  // false
 *          new b9j.path.Path("a").isEmpty()  // false
 */

        isEmpty: function() {
            return 1 == this._path.length && "" == this._path[0] && ! this._root ? true : false;
        },

/*
 * =head2 path.isRoot()
 *
 * Returns true if path is the root path ("/")
 *
 *          new b9j.path.Path("").isRoot()   // false
 *          new b9j.path.Path("/").isRoot()  // true
 *          new b9j.path.Path("a").isRoot()  // false
 */

        isRoot: function() {
            return 1 == this._path.length && "" == this._path[0] && this._root ? true : false;
        },

/*
 * =head2 path.isTree()
 *
 * Returns true if path begins with a slash
 *
 *          new b9j.path.Path("").isTree()    // false
 *          new b9j.path.Path("/").isTree()   // true
 *          new b9j.path.Path("a").isTree()   // false
 *          new b9j.path.Path("/a").isTree()  // true
 */

        isTree: function() {
            return this._root ? true : false;
        },

/*
 * =head2 path.isBranch()
 *
 * Returns true if path does NOT begin with a slash
 *
 *          new b9j.path.Path("").isBranch()    // true
 *          new b9j.path.Path("/").isBranch()   // false
 *          new b9j.path.Path("a").isBranch()   // true
 *          new b9j.path.Path("/a").isBranch()  // false
 */

        isBranch: function() {
            return ! this.isTree();
        },

/*
 * =head2 path.toTree()
 *
 * Modifies path by prepending a slash
 *
 *          new b9j.path.Path("").toTree()    // /
 *          new b9j.path.Path("/").toTree()   // /
 *          new b9j.path.Path("a").toTree()   // /a
 *          new b9j.path.Path("/a").toTree()  // /a
 */

        toTree: function() {
            this._root = true;
            if ("" == this._path[0]) return;
            this._path.splice(0, 0, "");
        },

/*
 * =head2 path.toBranch()
 *
 * Modifies path by removing the leading slash, if any
 *
 *          new b9j.path.Path("").toBranch()    // ""
 *          new b9j.path.Path("/").toBranch()   // ""
 *          new b9j.path.Path("a").toBranch()   // a
 *          new b9j.path.Path("/a").toBranch()  // a
 */

        toBranch: function() {
            this._root = false;
            if ("" != this._path[0]) return;
            this._path.splice(0, 1);
        },

/*
 * =head2 path.first()
 *
 * Returns the first part of path, not including any slashes
 *
 *          new b9j.path.Path("/a/b/c/").first()  // a
 */

        first: function() {
            return this.at(0);
        },

/*
 * =head2 path.last()
 *
 * Returns the last part of path, not including any slashes
 *
 *          new b9j.path.Path("/a/b/c/").last()  // c
 */

        last: function() {
            return this.at(-1);
        },

/*
 * =head2 path.at( $index )
 *
 * Returns the part of path at $index, not including any slashes
 * You can use a negative $index to start from the end of path
 *
 *          new b9j.path.Path("/a/b/c/").at(0)  // a (equivalent to path.first())
 *          new b9j.path.Path("/a/b/c/").at(-1) // c (equivalent to path.last())
 *          new b9j.path.Path("/a/b/c/").at(1)  // b
 *
 */
        _at: function(position) {
            if (this.isEmpty()) return -1;
            if (1 == this._path.length && "" == this._path[0])
                return -1;
            if (0 > position)
                position += this._path.length;
            else if ("" == this._path[0])
                position += 1;
            if (position >= this._path.length)
                return -1;
            if (position == this._path.length - 1 && "" == this._path[position])
                position -= 1;
            return position;
        },

        at: function(position) {
            position = this._at(position);
            if (-1 == position)
                return "";
            return this._path[position];
//            if (this.isEmpty()) return "";
//            if (1 == this._path.length && "" == this._path[0])
//                return "";
//            if (0 > ii)
//                ii += this._path.length;
//            else if ("" == this._path[0])
//                ii += 1;
//            if (ii >= this._path.length)
//                return "";
//            if (ii == this._path.length - 1 && "" == this._path[ii])
//                ii -= 1;
//            return this._path[ii];
        },

        setAt: function(position, value) {
            position = this._at(position);
            if (-1 == position)
                return;
            this._path[position] = value;
        },

/*
 * =head2 path.beginning()
 *
 * Returns the first part of path, including the leading slash, if any
 *
 *          new b9j.path.Path("/a/b/c/").beginning() // /a
 *          new b9j.path.Path("a/b/c/").beginning()  // a
 *
 */
        beginning: function() {
            if (this.isEmpty()) return "";
            if (this.isRoot()) return "/";
            var first = this.at(0);
            if (this.isBranch()) return first;
            return "/" + first;
            
        },

/*
 * =head2 path.ending()
 *
 * Returns the last part of path, including the trailing slash, if any
 *
 *          new b9j.path.Path("/a/b/c/").ending() // c/
 *          new b9j.path.Path("/a/b/c").ending()  // c
 *
 */
        ending: function() {
            if (this.isEmpty()) return "";
            if (this.isRoot()) return "/";
            var last = this.at(-1);
            if (last == this._path[this._path.length - 1]) return last;
            return last + "/";
            
        },

/*
 * =head2 path.list()
 *
 * Returns an array of the parts of path
 *
 *          new b9j.path.Path().list()          // []
 *          new b9j.path.Path("/").list()       // []
 *          new b9j.path.Path("/a/b/c/").list() // [ "a", "b", "c" ]
 *          new b9j.path.Path("a/b/c/").list()  // [ "a", "b", "c" ]
 *
 */
        list: function() {
            if (this.isEmpty()) return [];
            if (this.isRoot()) return [];
            var path = [].concat(this._path);
            if ("" == path[0]) path.splice(0, 1);
            if ("" == path[path.length - 1]) path.splice(path.length - 1, 1);
            return path;
        }
    };

}());

/*
 * =head1 SEE ALSO
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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
/* 
 * =head1 NAME
 * 
 * b9j.uri - URI (Uniform Resource Identifier) parsing, manipulation, and generation
 *
 * =head1 SYNOPSIS 
 *
 *      var uri = new b9j.uri.URI( "http://example.com/a/b?a=1&b=2&c=3&c=4&c=5" )
 *      var host = uri.host()
 *
 *      var uriChild = uri.child("c.html")          // http://example.com/a/b/c.html?a=1&b=2& ...
 *      uriChild.query.add({ c: [ 6, 7 ], d: 8 })   // ... ?a=1&b=2&c=3&c=4&c=5&c=6&c=7&d=8
 *      uriChild.query.set("b", 9)                  // ... ?a=1&b=9&c ...
 *
 *      return uriChild.toString()
 *  
 * =head1 DESCRIPTION
 *
 * This package provides a way to parse, manipulate, and generate URIs. Specifically, it
 * splits up a URI into three objects: the URI, the path, and the query. The path and query are subordinate, 
 * and changes to either object will be reflected in their "owner" URI.
 *
 * It uses a modified parseUri (by Steven Levithan) for URI parsing: [http://blog.stevenlevithan.com/archives/parseuri](http://blog.stevenlevithan.com/archives/parseuri)
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
    _parseURI.partName = ["source","scheme","authority","userInformation","user","password","host","port","relative","path","directory","file","query","fragment"];
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
 *      scheme
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
 * =head2 b9j.uri.location()
 *
 * Returns a new URI object representing the current value of `window.location`
 *
 */

    pckg.location = function() {
        return new b9j.uri.URI(window.location.href);
    };

/*
 * =head2 new b9j.uri.Uri( $uri )
 *
 * Returns a new URI object representing $uri, which can either be a string or a hash resulting
 * from b9j.uri.parse
 *
 */

    pckg.URI = function(uri, query, $options) {
        if (! $options) $options = {};
        this.set(uri, query, $options);
    };

    pckg.URI.prototype = {
        
/*
 * =head2 uri.clone()
 *
 * Returns a clone of uri
 * 
 */


        clone: function() {
//            var uri = b9j.clone(this._uri);
//            uri.query = b9j.clone(this._query._store, { shallowObject: 1 });
            return new b9j.uri.URI(this.toString());
        },

        source: function(value) {
            if (arguments.length) {
                this._uri.source = value;
                return this;
            }
            return this._uri.source;
        },

/*
 * =head2 uri.scheme()
 *
 * =head2 uri.scheme( $scheme )
 *
 * Returns the scheme of uri, which is something like `http`, `https`, `ftp`, ...
 *
 *      http://alice:xyzzy@www.example.net:8080/apple/banana/?a=1&b=2&c=3&c=4&c=5#top => http
 *
 * Sets the scheme of uri to $scheme
 *
 * Returns uri
 *
 * =head2 uri.protocol()
 *
 * =head2 uri.protocol( $protocol )
 *
 * An alias for uri.scheme() and uri.scheme( ... )
 *
 */
        scheme: function(value) {
            if (arguments.length) {
                this._uri.scheme = value;
                return this;
            }
            return this._uri.scheme;
        },

        protocol: function(value) {
            return this.scheme.apply(this, arguments);
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
                if ("" != hostPort && ! b9j.isEmpty( this.port() )) {
                    hostPort += ":";
                    hostPort += this.port();
                }
    
                var authority = "";
                authority += this.userInformation();
                if (! b9j.isEmpty( authority ))
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
                if (":" == userInformation)
                    userInformation = "";
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

        path: function(value) {
            if (arguments.length) {
                this._path = new b9j.path.Path(value);
                this._path.toTree();
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
            return clone;
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
            return clone;
        },

/*
 * =head2 uri.append( $part1, [ $part2 ], ... )
 *
 * Modify uri by appending $part1 WITHOUT separating it by a slash. Any, optional,
 * following $part2, ..., will be separated by slashes as normal
 *
 *          var uri = new b9j.uri.URI( "http://example.net/a/b/c" )
 *          uri.append( "d", "ef/g", "h" ) // "http://example.net/a/b/cd/ef/g/h"
 *
 */
        append: function() {
            this._path.append.apply(this._path, arguments);
            return this;
        },

/*
 * =head2 uri.extension()
 *
 * Returns the extension of uri, including the leading the dot
 *
 * Returns "" if uri does not have an extension
 *
 *          new b9j.uri.URI( "http://example.net/a/b/c.html" ).extension() // .html
 *          new b9j.uri.URI( "http://example.net/a/b/c" ).extension() // ""
 *          new b9j.uri.URI( "http://example.net/a/b/c.tar.gz" ).extension() // .gz
 *          new b9j.uri.URI( "http://example.net/a/b/c.tar.gz" ).extension({ match: "*" }) // .tar.gz
 *
 * =head2 uri.extension( $extension )
 *
 * Modify uri by changing the existing extension of uri, if any, to $extension
 *
 *          new b9j.uri.URI( "http://example.net/a/b/c.html" ).extension( ".txt" ) // http://example.net/a/b/c.txt
 *          new b9j.uri.URI( "http://example.net/a/b/c.html" ).extension( "zip" ) // http://example.net/a/b/c.zip
 *          new b9j.uri.URI( "http://example.net/a/b/c.html" ).extension( "" ) // http://example.net/a/b/c
 *
 * Returns uri
 *
 */
        extension: function() {
            var gotten = this._path.extension.apply(this._path, arguments);
            if (gotten == this._path)
                return this;
            else
                return gotten;
        },

/*
 * =head2 uri.set( $uri ) 
 *
 * Set the uri to $uri, completely reinitializing the object (including path and query)
 *
 */
        set: function(uri, query, $options) {
            if ($options) this._options = $options;
            this._uri = b9j.uri.parse(uri, this._options.strict);
            this.query(this._uri.queryHash ? this._uri.queryHash : this._uri.query);
//            delete this._uri.query;
//            delete this._uri.queryHash;
            this.path(this._uri.path);
            if (query) {
                if ($options.addQuery) {
                    this.mergeQuery(query);
                }
                else if ($options.replaceQuery) {
                    this.mergeQuery(query, { replace: 1 });
                }
                else { // by default, .setQuery
                    this.query(query);
                }
            }
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
        mergeQuery: function(query, $options) {
            this.query().merge(query, $options);
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

            if (! b9j.isEmpty(value = this.scheme())) {
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
 * =head2 query.get()
 *
 * Returns the query store directly as a hash (simple object), so you can do the following:
 *
 *      var hash = new b9j.uri.query.Query("a=1&b=2")
 *      if (query.get.a) { ...
 *
 * =head2 query.get( $key )
 *
 * Returns the value for $key
 * If $key is multi-value, then return only the first value of $key
 *
 */
        get: function(key) {

            if (0 == arguments.length)
                return this._store;

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
 * =head2 query.add( $query )
 *
 * Add $query to query, where $query can be a query string or hash (simple object)
 *
 * Returns query
 *
 * =head2 query.add( $key, $value )
 *
 * Add $value to $key
 *
 * If $key does not exist, then $key is set to $value  
 * If $key already has a value, multiple or otherwise, then $value is appended  
 *
 * =head2 query.add( $key, $value1, $value2, ... )
 *
 * Add $value1, $value2, ... to $key, turning it into a multi-value key
 *
 * Returns query
 *
 */

        add: function(key, value) {

            if (arguments.length == 1) {
                var hash = b9j.uri.query.parse(key); // query.add( $query )
                                                     // Not really a key, actually a query string or hash
                for (key in hash) {
                    this.add(key, hash[key]);
                }
            }
            else {

                if (arguments.length > 2) { // query.add( $key, $value1, $value2, ... )
                    value = Array.prototype.splice.call(arguments, 1);
                }

                var store_value;
                if (b9j.isValue(store_value = this._store[key])) {
                    if (b9j.isArray( store_value )) {
                        if (b9j.isArray( value )) {
                            this._store[key] = store_value.concat(value);
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
        merge: function(query, $options) {
            if ($options && $options.replace) {
                query = b9j.uri.query.parse(query);
                this._store = b9j.merge(this._store, query);
            }
            else {
                this.add(query);
            }
            return this;
        },

/*
 * =head2 query.append( $queryString )
 *
 * Append $query_string to the output of query.toString()
 *
 * This will NOT do any encoding on $queryString, nor can you otherwise
 * manipulate the contests using query.set, etc.
 *
 * Pass in null to erase the previous $querString
 *
 * Returns query
 *
 */

        append: function(queryString) {
            if (b9j.isValue(queryString)) {
                this._queryString = queryString;
            }
            else {
                delete this._queryString;
            }
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
            return b9j.isEmpty(this._queryString);
        },

/*
 * =head2 query.toString()
 *
 * Returns query in string-form
 *
 */

        toString: function() {
            if (this.isEmpty()) {
                return "";
            }
            var toString = "";
            var keyValueList = [];
            for (key in this._store) {
                key = encodeURIComponent(key);
                var value = this._store[key];

                if (b9j.isArray(value)) {
                    for (var ii = 0; ii < value.length; ii++) {
                        if (null != value[ii]) {
                            keyValueList.push(key + "=" + encodeURIComponent(value[ii]));
                        }
                        else {
                            keyValueList.push(key);
                        }
                    }
                }
                else {
                    if (null != value) {
                        keyValueList.push(key + "=" + encodeURIComponent(value));
                    }
                    else {
                        keyValueList.push(key);
                    }
                }
            } 
            var queryString = this._queryString;
            if (null != queryString) {
                keyValueList.push(queryString);
            }
            toString = keyValueList.join("&");
            return toString;
        }

    };

}());

/*
 * =head1 SEE ALSO
 *
 * [parseUri](http://blog.stevenlevithan.com/archives/parseuri)
 *
 * [js-uri](http://code.google.com/p/js-uri/)
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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
/* 
 * =head1 NAME
 * 
 * b9j.digest - A SHA-256 digester
 *
 * =head1 SYNOPSIS 
 *
 *      ... = b9j.digest.sha256.calculate16( "Hello, World." ) // Hexadecimal, base 16
 *      ... = b9j.digest.sha256.calculate64( "Hello, World." ) // Base 64
 *      ... = b9j.digest.sha256.calculate( "Hello, World." ) // Binary string (byte string), base 256
 *  
 * =head1 DESCRIPTION
 *
 * A SHA-256 digester (implementation by Angel Marin [http://anmar.eu.org/projects/jssha2/](http://anmar.eu.org/projects/jssha2/))
 *
 * =head1 METHODS
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.digest.sha256');

/*
 * =head2 calculate16( $input )
 *
 * =head2 hexadecimal( $input )
 *
 * =head2 hex( $input )
 *
 * Calculate the SHA-256 digest of $input and return the result as a hexadecimal (base16) value
 *
 */
    pckg.calculate16 = pckg.base16 = pckg.hexadecimal = pckg.hex = function(string) {
        return binb2hex(core_sha256(str2binb(string),string.length * chrsz));
    };

/*
 * =head2 calculate64( $input )
 *
 * =head2 base64( $input )
 *
 * Calculate the SHA-256 digest of $input and return the result as a base64 (= padded) value
 *
 */

    pckg.calculate64 = pckg.base64 = function(string) {
        return binb2b64(core_sha256(str2binb(string),string.length * chrsz));
    };

/*
 * =head2 calculate256( $input )
 *
 * =head2 calculate( $input )
 *
 * Calculate the SHA-256 digest of $input and return the result as a binary string (byte string), base 256
 *
 */

    pckg.calculate = pckg.calculate256 = function (string) {
        return binb2str(core_sha256(str2binb(string),string.length * chrsz));
    };

        /* A JavaScript implementation of the Secure Hash Algorithm, SHA-256
         * Version 0.3 Copyright Angel Marin 2003-2004 - http://anmar.eu.org/
         * Distributed under the BSD License
         * Some bits taken from Paul Johnston's SHA-1 implementation
         */
        var chrsz = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode  */
        function safe_add (x, y) {
          var lsw = (x & 0xFFFF) + (y & 0xFFFF);
          var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
          return (msw << 16) | (lsw & 0xFFFF);
        }
        function S (X, n) {return ( X >>> n ) | (X << (32 - n));}
        function R (X, n) {return ( X >>> n );}
        function Ch(x, y, z) {return ((x & y) ^ ((~x) & z));}
        function Maj(x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));}
        function Sigma0256(x) {return (S(x, 2) ^ S(x, 13) ^ S(x, 22));}
        function Sigma1256(x) {return (S(x, 6) ^ S(x, 11) ^ S(x, 25));}
        function Gamma0256(x) {return (S(x, 7) ^ S(x, 18) ^ R(x, 3));}
        function Gamma1256(x) {return (S(x, 17) ^ S(x, 19) ^ R(x, 10));}
        function core_sha256 (m, l) {
            var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
            var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
            var W = new Array(64);
            var a, b, c, d, e, f, g, h, i, j;
            var T1, T2;
            /* append padding */
            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;
            for ( var i = 0; i<m.length; i+=16 ) {
                a = HASH[0]; b = HASH[1]; c = HASH[2]; d = HASH[3]; e = HASH[4]; f = HASH[5]; g = HASH[6]; h = HASH[7];
                for ( var j = 0; j<64; j++) {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                    h = g; g = f; f = e; e = safe_add(d, T1); d = c; c = b; b = a; a = safe_add(T1, T2);
                }
                HASH[0] = safe_add(a, HASH[0]); HASH[1] = safe_add(b, HASH[1]); HASH[2] = safe_add(c, HASH[2]); HASH[3] = safe_add(d, HASH[3]); HASH[4] = safe_add(e, HASH[4]); HASH[5] = safe_add(f, HASH[5]); HASH[6] = safe_add(g, HASH[6]); HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }
        function str2binb (str) {
          var bin = Array();
          var mask = (1 << chrsz) - 1;
          for(var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
          return bin;
        }
        function binb2hex (binarray) {
          var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
          var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
          var str = "";
          for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
          }
          return str;
        }
        function binb2str (bin) {
          var str = "";
          var mask = (1 << chrsz) - 1;
          for(var i = 0; i < bin.length * 32; i += chrsz)
            str += String.fromCharCode((bin[i>>5] >>> (24 - i%32)) & mask);
          return str;
        }
        function binb2b64 (binarray) {
            var b64pad = "=";
          var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var str = "";
          for(var i = 0; i < binarray.length * 4; i += 3)
          {
            var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                        | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                        |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
            for(var j = 0; j < 4; j++)
            {
              if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
              else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
            }
          }
          return str;
        }

}());

/*
 * =head1 SEE ALSO
 *
 * [http://anmar.eu.org/projects/jssha2/](http://anmar.eu.org/projects/jssha2/)
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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
/* 
 * =head1 NAME
 * 
 * b9j.random - Generate pseudo-random binary-string, hexadecimal, or base64 data of arbritrary length
 *
 * =head1 SYNOPSIS 
 *
 *      var result
 *
 *      result = b9j.random.generate() 
 *      // result is a random binary string (base256) of length 32 
 *
 *      result = b9j.random.generate64(4) 
 *      // result is a random base64 (truncated) string of length 4
 *
 *      result = b9j.random.generate16(121) 
 *      // result is a random hexadecimal string (base16, truncated) of length 121
 *
 * =head1 DESCRIPTION
 *
 * Generate pseudo-random binary, hexadecimal, or base64 data of arbritrary length
 *
 * The generator has two parts: the seeder and the digester.  The seeder is basically:
 *
 *     "" + ++<counter> + Math.random() + new Date().getTime()
 *
 * The digester is [b9j.digest.sha256](http://appengine.bravo9.com/b9j/documentation/digest.sha256.html), which
 * takes the resulting seed and makes it look "obscure" by calculating the SHA-256 digest of it.
 *
 * =head1 METHODS
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.random');

    pckg._seederCounter = b9j.random._seederCounter ||  0;
    pckg._seeder = function() {
        return "" + ++b9j.random._seederCounter + Math.random() + new Date().getTime();
    };

    pckg._create16 = function() {
        return b9j.digest.sha256.calculate16( b9j.random._seeder() );
    };

    pckg._create64 = function() {
        return b9j.digest.sha256.calculate64( b9j.random._seeder() );
    };

    pckg._create256 = function() {
        return b9j.digest.sha256.calculate256( b9j.random._seeder() );
    };

    pckg._create = function(method, length) {

        if (! length)
            return method();

        var result = "";
        while (result.length < length) {
            result += method();
        }

        return result.substr(0, length);

    };

/*
 * =head2 generate( [ $length ] )
 *
 * =head2 generate256( [ $length ] )
 *
 * =head2 generateBase256( [ $length ] )
 *
 * Returns a pseudo-random binary string (base 256) of length $length
 *
 * If $length is not given, then it defaults to 32
 *
 */
    pckg.generate = function(length) {
        return b9j.random._create(b9j.random._create256, length);
    };

    pckg.generate256 = pckg.generateBase256 = function() {
        return b9j.random.generate.apply(this, arguments);
    };
/*
 * =head2 generate16( [ $length ] )
 *
 * =head2 generateHexadecimal( [ $length ] )
 *
 * =head2 generateHex( [ $length ] )
 *
 * =head2 generateBase16( [ $length ] )
 *
 * Returns a pseudo-random hexadecimal (base16) string of length $length
 *
 * If $length is not given, then it defaults to 64
 *
 */
    pckg.generate16 = function(length) {
        return b9j.random._create(b9j.random._create16, length);
    };

    pckg.generateHexadecimal = pckg.generateHex = pckg.generateBase16 = function() {
        return b9j.random.generate16.apply(this, arguments);
    };

/*
 * =head2 generate64( [ $length ] )
 *
 * =head2 generateBase64( [ $length ] )
 *
 * Returns a pseudo-random base64 string of length $length
 *
 * If $length is not given, then it defaults to 44
 *
 */

    pckg.generate64 = function(length) {
        return b9j.random._create(b9j.random._create64, length);
    };

    pckg.generateBase64 = function() {
        return b9j.random.generate64.apply(this, arguments);
    };

}());

/*
 * =head1 SEE ALSO
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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
/* 
 * =head1 NAME
 * 
 * b9j.pguid - Page-unique identifier generation
 *
 * =head1 SYNOPSIS 
 *
 *      pguid = b9j.pguid.next() // A unique id (suitable for a DOM element) is generated
 *                               // Something like "b9j-pguid-20a9ff-0"
 *      ...
 *      pguid = b9j.pguid.next() // Another unique one... "b9j-pguid-20a9ff-1"
 *      
 *      // Build a custom generator
 *      var sequence = new b9j.pguid.Sequence({ namespace: "frobozz" })
 *      pguid = sequence.next() "frobozz-c861e1-0"
 *
 * =head1 DESCRIPTION
 *
 * A page-unique identifier is useful when you need to assign some identifier to DOM element but can't
 * be bothered to dream up a custom one (every time)
 *
 * =head1 METHODS
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.pguid');
    var clss;

/*
 * =head2 b9j.pguid.next()
 *
 * Returns the next identifier in the b9j.pguid sequence singleton
 *
 */

    pckg.next = function() {
        var _singleton = b9j.pguid.sequence();
        return _singleton.next.apply(_singleton, arguments);
    };

/*
 * =head2 b9j.pguid.assign( $element )
 *
 * Uses the b9j.pguid sequence singleton to assign a pguid to $element, if necessary
 *
 * Returns either the existing or newly-generated identifier
 * 
 */

    pckg.assign = function() {
        var _singleton = b9j.pguid.sequence();
        return _singleton.assign.apply(_singleton, arguments);
    };

/*
 * =head2 b9j.pguid.sequence()
 *
 * Returns the b9j.pguid sequence singleton, which is configured with the
 * namespace "b9j-pguid"
 *
 */
    var singleton;
    pckg.sequence = function() {
        if (singleton) return singleton;
        return singleton = new b9j.pguid.Sequence({ namespace: "b9j-pguid" });
    };

/*
 * =head2 new b9j.pguid.Sequence( { ... } ) 
 *
 * Returns a new pguid generator configured with the following options:
 *
 *      namespace       # The prefix for each generated identifier
 *                      # By default, this is "pguid"
 *
 *      start           # The number to start counting at
 *                      # By default, this is 0
 *
 * An example:
 *
 *      ... = new b9j.pguid.Sequence({ namespace: "frobozz", start: 3 })
 *
 */

    clss = pckg.Sequence = function(given) {
        if (! given) given = {};
        this.counter = given.start || 0;

        var namespace = given.namespace || "pguid";
        namespace += "-" + b9j.random.generate16(6) + "-";
        this.namespace = namespace;
    };

    clss.prototype = {
        
/*
 * =head2 sequence.next()
 *
 * Returns the next identifier in the sequence
 *
 */
        next: function() {
            var number = this.counter++;
            return this.namespace + number;
        },

/*
 * =head2 sequence.assign( $element )
 *
 * If $element does not have an "id" property, then generate the next unique
 * identifier in the sequence, assign it to $element.id, and return the identifier
 *
 * If $element already has an "id" property, then simply return $element.id (no
 * new identifier is generated)
 *
 */
        assign: function(el) {

            if (el && el.id)
                return el.id; // Do not override existing id, just like YUI

            var id = this.next();

            if (el)
                el.id = id;

            return id;
        }
    };


}());

/*
 * =head1 SEE ALSO
 *
 * [YAHOO.util.Dom.generateId](http://developer.yahoo.com/yui//docs/YAHOO.util.Dom.html#method_generateId) - The inspiration for this module
 * 
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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
/* 
 * =head1 NAME
 * 
 * b9j.chunker -
 *
 * =head1 SYNOPSIS 
 *
 * =head1 DESCRIPTION
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.chunker');
    pckg.encodeBeforeChunking = true;

    function sendChunk(uri, query, payload, handler) {
        var _uri = uri.clone();
        _uri.query().set(query);
        if ( b9j.chunker.encodeBeforeChunking ) {
            jQuery.getJSON(_uri + "&cp=" + payload + "&cb=?", handler);
        }
        else {
            _uri.query().set("cp", payload);
            jQuery.getJSON(_uri + "&cb=?", handler);
        }

    }

    function sendMessage(uri, message, handler) {

        uri = new b9j.uri.URI(uri);

        if (! jQuery)
            throw "jQuery is required for b9j.chunker";
        if ( "object" == typeof message )
            message = YAHOO.lang.JSON.stringify(message);
        if ( b9j.chunker.encodeBeforeChunking )
            message = encodeURIComponent(message)

        var payload;
        var payload_size = 1400;
        if (message.length > payload_size) {
            payload = [];
            var from = 0;
            while (from < message.length) {
                var length = from + payload_size > message.length ? message.length - from : payload_size;
                if ( b9j.chunker.encodeBeforeChunking )
                    if (message[from + length - 1] == '%')
                        length -= 1;
                    else if (message[from + length - 2] == '%')
                        length -= 2;
                payload.push(message.substr(from, length));
                from += length;
            }
        }
        else 
            payload = [ message ];

        jQuery.ajaxSetup({ async: false });
        sendChunk(uri, { ml: payload.length }, payload[0], function(data){
            var rank = 0;
            if (data.complete && handler) {
                handler(data)
            }
            else {
                while(true) {
                    rank += 1;
                    payload.splice(0, 1);

                    if (! payload.length)
                        break;

                    sendChunk(uri, { mk: data.mk, cr: rank }, payload[0], function(data){
                        if (data.complete && handler) {
                            handler(data)
                        }
                    });
                }
            }
        });
    }

    pckg.send = sendMessage;


}());

/*
 * =head1 SEE ALSO
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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
/* 
 * =head1 NAME
 * 
 * b9j.environment -
 *
 * =head1 DESCRIPTION
 *
 * =head1 METHODS
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.environment');

    pckg.detect = function(userAgent) {
        if (b9j.isEmpty(userAgent))
            userAgent = navigator.userAgent;
        userAgent = userAgent.toLowerCase();

        var $ua = YAHOO.env.ua;
        var bv, b;
        if (0)
            ;
        else if ((bv = $ua.air) > 0) b = "air";
        else if ((bv = $ua.gecko) > 0) b = "gecko";
        else if ((bv = $ua.ie) > 0) b = "ie";
        else if ((bv = $ua.opera) > 0) b = "opera";
        else if ((bv = $ua.webkit) > 0) b = "webkit";
        else {
            b = "unknown";
            bv = 0;
        }

        var gotten = {};
        gotten.user_agent = navigator.userAgent;

        var browser = getBrowser(userAgent);
        gotten.browser = browser[0];
        gotten.browser_version = browser[1];
        gotten.engine = b;
        gotten.engine_version = bv;
        gotten.mobile = $ua.mobile;

        var platform = getPlatform(userAgent);
        gotten.platform = platform[0];
        gotten.platform_version = platform[1];

//        gotten.javascript_version = getJavascriptVersion(userAgent);

        return gotten;

    };

            /*
             * jsBrwSniff v0.5
             *
             * A browser sniffer library
             * http://jsbrwsniff.sf.net
             *
             * Released under the GNU LGPL license
             * Author: Pau Garcia i Quiles <paugq AT users DOT sourceforge DOT net>
             *
             */


            function getBrowser(obj) {
                var b=new Array("unknown", "unknown", "unknown", "unknown");

                (isEmpty(obj) ? brs=navigator.userAgent.toLowerCase() : brs=obj);

                if (brs.search(/omniweb[\/\s]v?(\d+([\.-]\d)*)/) != -1) {
                // Omniweb
                    b[0]="omniweb";
                    b[1]=brs.match(/omniweb[\/\s]v?(\d+([\.-]\d)*)/)[1];
                    (b[1] > 4.5 ? b[2]="khtml" : b[2]="omniweb");
                    (brs.search(/omniweb[\/\s]((\d+([\.-]\d)*)-)?v(\d+([\.-]\d)*)/) == -1 ?       b[3]=brs.match(/omniweb[\/\s](\d+([\.-]\d)*)/)[1] :        b[3]=brs.match(/omniweb[\/\s]((\d+([\.-]\d)*)-)?v(\d+([\.-]\d)*)/)[4]);
                    return b;
                } else if (brs.search(/opera[\/\s](\d+(\.?\d)*)/) != -1) {
                // Opera
                    b[0]="opera";
                    b[1]=brs.match(/opera[\/\s](\d+(\.?\d)*)/)[1];
                    b[2]="opera";
                    b[3]=b[1];
                    return b;
                } else if (brs.search(/crazy\s?browser\s(\d+(\.?\d)*)/) != -1) {
                // Crazy Browser
                    b[0]="crazy";
                    b[1]=brs.match(/crazy\s?browser\s(\d+(\.?\d)*)/)[1];
                    b[2]="msie";
                    b[3]=getMSIEVersion();
                    return b;
                } else if (brs.search(/myie2/) != -1) {
                // MyIE2
                    b[0]="myie2";
                    b[2]="msie";
                    b[3]=brs.match(/msie\s(\d+(\.?\d)*)/)[1];
                    return b;
                } else if (brs.search(/netcaptor/) != -1) {
                // NetCaptor
                    b[0]="netcaptor";
                    b[1]=brs.match(/netcaptor\s(\d+(\.?\d)*)/)[1];
                    b[2]="msie";
                    b[3]=getMSIEVersion();
                    return b;
                } else if (brs.search(/avant\sbrowser/) != -1) {
                // Avant Browser
                    b[0]="avantbrowser";
                    b[2]="msie";
                    b[3]=getMSIEVersion();
                    return b;
                } else if (brs.search(/msn\s(\d+(\.?\d)*)/) != -1) {
                // MSN Explorer
                    b[0]="msn";
                    b[1]=brs.match(/msn\s(\d+(\.?\d)*)/)[1];
                    b[2]="msie";
                    b[3]=getMSIEVersion();
                    return b;
                } else if (brs.search(/msie\s(\d+(\.?\d)*)/) != -1) {
                // MS Internet Explorer
                    b[0]="msie";
                    b[1]=getMSIEVersion();
                    b[2]="msie";
                    b[3]=b[1];
                    return b;
                } else if (brs.search(/powermarks\/(\d+(\.?\d)*)/) != -1) {
                // PowerMarks
                    b[0]="powermarks";
                    b[1]=brs.match(/powermarks\/(\d+(\.?\d)*)/)[1];
                    b[2]="msie";
                    try {
                        b[3]=getMSIEVersion();
                    } catch (e) { }
                    return b;
            } else if (brs.search(/konqueror[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Konqueror
                    b[0]="konqueror";
                    b[1]=brs.match(/konqueror[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="khtml";
                    return b;
                } else if (brs.search(/safari\/(\d)*/) != -1) {
                // Safari
                    b[0]="safari";
                    b[1]=brs.match(/safari\/(\d+(\.?\d*)*)/)[1];
                    b[2]="khtml";
                    b[3]=brs.match(/applewebkit\/(\d+(\.?\d*)*)/)[1];
                    return b;
                } else if(brs.search(/zyborg/) != -1) {
                // Zyborg (SSD)
                    b[0]="zyborg";
                    b[1]=brs.match(/zyborg\/(\d+(\.?\d)*)/)[1];
                    b[2]="robot";
                    b[3]="-1"
                    return b;
                } else if (brs.search(/netscape6[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Netscape 6.x
                    b[0]="netscape";
                    b[1]=brs.match(/netscape6[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/netscape\/(7\.\d*)/) != -1) {
                // Netscape 7.x
                    b[0]="netscape";
                    b[1]=brs.match(/netscape\/(7\.\d*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/galeon[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Galeon
                    b[0]="galeon";
                    b[1]=brs.match(/galeon[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/nautilus[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Nautilus
                    b[0]="nautilus";
                    b[1]=brs.match(/nautilus[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/firefox[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Firefox
                    b[0]="firefox";
                    b[1]=brs.match(/firefox[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/k-meleon[\/\s](\d+([\.-]\d)*)/) != -1) {
                // K-Meleon
                    b[0]="kmeleon";
                    b[1]=brs.match(/k-meleon[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/playstation\s3/) != -1) {
                // Playstation 3
                    b[0]="netfront";
                    b[1]="2.81"; // Taken from the Wikipedia article
                    b[2]="playstation3"
                    b[3]=brs.match(/playstation\s3;\s(\d+\.\d+)/)[1];
                    return b;
                } else if (brs.search(/firebird[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Firebird
                    b[0]="firebird";
                    b[1]=brs.match(/firebird[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/phoenix[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Phoenix
                    b[0]="phoenix";
                    b[1]=brs.match(/phoenix[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/camino[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Camino
                    b[0]="camino";
                    b[1]=brs.match(/camino[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/epiphany[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Epiphany
                    b[0]="epiphany";
                    b[1]=brs.match(/epiphany[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/chimera[\/\s](\d+([\.-]\d)*)/) != -1) {
                // Chimera
                    b[0]="chimera";
                    b[1]=brs.match(/chimera[\/\s](\d+([\.-]\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/icab[\s\/]?(\d+(\.?\d)*)/) !=-1) {
                // iCab
                    b[0]="icab";
                    b[1]=brs.match(/icab[\s\/]?(\d+(\.?\d)*)/)[1];
                    b[2]="icab";
                    b[3]=b[1];
                    return b;
                } else if (brs.search(/netfront\/(\d+([\._]\d)*)/) != -1) {
                // NetFront
                    b[0]="netfront";
                    b[1]=brs.match(/netfront\/(\d+([\._]\d)*)/)[1];
                    b[2]="netfront";
                    b[3]=b[1];
                    return b;
                } else if (brs.search(/netscape4\/(\d+([\.-]\d)*)/) != -1) {
                // Netscape 4.x
                    b[0]="netscape";
                    b[1]=brs.match(/netscape4\/(\d+([\.-]\d)*)/)[1];
                    b[2]="mozold";
                    b[3]=b[1];
                    return b;
                } else if ( (brs.search(/mozilla\/(4.\d*)/) != -1) && (brs.search(/msie\s(\d+(\.?\d)*)/) == -1) ) {
                    b[0]="netscape";
                    b[1]=brs.match(/mozilla\/(4.\d*)/)[1];
                    b[2]="mozold";
                    b[3]=b[1];
                    return b;
                } else if ((brs.search(/mozilla\/5.0/) != -1) && (brs.search(/gecko\//) != -1)) {
                // Mozilla Seamonkey
                    b[0]="mozsea";
                    b[1]=brs.match(/rv\x3a(\d+(\.?\d)*)/)[1];
                    b[2]="gecko";
                    b[3]=getGeckoVersion();
                    return b;
                } else if (brs.search(/elinks/) != -1) {
                // ELinks
                    b[0]="elinks";
                    (brs.search(/elinks\/(\d+(\.?\d)*)/) == -1 ?
            b[1]=brs.match(/elinks\s\x28(\d+(\.?\d)*)/)[1] :
            b[1]=brs.match(/elinks\/(\d+(\.?\d)*)/)[1]);
                    b[2]="elinks";
                    b[3]=b[1];
                    return b;
                } else if (brs.search(/w3m\/(\d+(\.?\d)*)/) != -1) {
                // w3m
                    b[0]="w3m"
                    b[1]=brs.match(/(^w3m|\sw3m)\/(\d+(\.?\d)*)/)[2];
                    b[2]="w3m";
                    b[3]=b[1];
                    return b;
                } else if (brs.search(/links/) != -1) {
                // Links
                    b[0]="links";
                    (brs.search(/links\/(\d+(\.?\d)*)/) == -1 ? b[1]=brs.match(/links\s\x28(\d+(\.?\d)*)/)[1] : b[1]=brs.match(/links\/(\d+(\.?\d)*)/)[1]);
                    b[2]="links";
                    b[3]=b[1];
                    return b;
                } else if (brs.search(/java[\/\s]?(\d+([\._]\d)*)/) != -1) {
                // Java (as web-browser)
                    b[0]="java";
                    b[1]=brs.match(/java[\/\s]?(\d+([\._]\d)*)/)[1];
                    b[2]="java";
                    b[3]=b[1];
                    return b;
                } else if(brs.search(/lynx/) != -1) {
                // Lynx (SSD)
                    b[0]="lynx";
                    b[1]=brs.match(/lynx\/(\d+(\.?\d)*)/)[1];
                    b[2]="libwww-fm";
                    b[3]=brs.match(/libwww-fm\/(\d+(\.?\d)*)/)[1];
                    return b;
                } else if(brs.search(/dillo/) != -1) {
                // Dillo (SSD)
                    b[0]="dillo";
                    b[1]=brs.match(/dillo\s*\/*(\d+(\.?\d)*)/)[1];
                    b[2]="dillo";
                    b[3]=b[1];
                    return b;
                } else if(brs.search(/wget/) != -1) {
                // wget (SSD)
                    b[0]="wget";
                    b[1]=brs.match(/wget\/(\d+(\.?\d)*)/)[1];
                    b[2]="robot";
                    b[3]="-1"
                    return b;
                } else if(brs.search(/googlebot\-image/) != -1) {
                // GoogleBot-Image (SSD)
                    b[0]="googlebotimg";
                    b[1]=brs.match(/googlebot\-image\/(\d+(\.?\d)*)/)[1];
                    b[2]="robot";
                    b[3]="-1"
                    return b;
                } else if(brs.search(/googlebot/) != -1) {
                // GoogleBot (SSD)
                    b[0]="googlebot";
                    b[1]=brs.match(/googlebot\/(\d+(\.?\d)*)/)[1];
                    b[2]="robot";
                    b[3]="-1"
                    return b;
                } else if(brs.search(/msnbot/) != -1) {
                // MSNBot (SSD)
                    b[0]="msnbot";
                    b[1]=brs.match(/msnbot\/(\d+(\.?\d)*)/)[1];
                    b[2]="robot";
                    b[3]="-1"
                    return b;
                } else if(brs.search(/turnitinbot/) != -1) {
                // Turnitin (SSD)
                    b[0]="turnitinbot";
                    b[1]=brs.match(/turnitinbot\/(\d+(\.?\d)*)/)[1];
                    b[2]="robot";
                    b[3]="-1"
                    return b;
                } else {
                    b[0]="unknown";
                    return b;
                }
            }

            // Return browser's (actual) major version or -1 if bad version entered
            function getMajorVersion(v) {
                return (isEmpty(v) ? -1 : (hasDot(v) ? v : v.match(/(\d*)(\.\d*)*/)[1]))
            }

            // Return browser's (actual) minor version or -1 if bad version entered
            function getMinorVersion(v) {
                return (!isEmpty(v) ? (!hasDot(v) ? v.match(/\.(\d*([-\.]\d*)*)/)[1] : 0) :
            -1)
            }

            // Return operating system we are running on top of
            function getPlatform(obj) {

                var os=new Array("unknown", "unknown");

                (isEmpty(obj) ? brs=navigator.userAgent.toLowerCase() : brs=obj);

                if (brs.search(/windows\sce/) != -1) {
                    os[0]="wince";
                    try {
                        os[1]=brs.match(/windows\sce\/(\d+(\.?\d)*)/)[1];
                    } catch (e) { }
                    return os;
                } else if ( (brs.search(/windows/) !=-1) || ((brs.search(/win9\d{1}/) !=-1))
            ) {
                    os[0]="win";
                    if (brs.search(/nt\s5\.1/) != -1) {
                        os[1]="xp";
                    } else if (brs.search(/nt\s5\.0/) != -1) {
                        os[1]="2000";
                    } else if ( (brs.search(/win98/) != -1) || (brs.search(/windows\s98/)!=
            -1 ) ) {
                        os[1]="98";
                    } else if (brs.search(/windows\sme/) != -1) {
                        os[1]="me";
                    } else if (brs.search(/nt\s5\.2/) != -1) {
                        os[1]="2k3";
                    } else if ( (brs.search(/windows\s95/) != -1) || (brs.search(/win95/)!=
            -1 ) ) {
                        os[1]="95";
                    } else if ( (brs.search(/nt\s4\.0/) != -1) || (brs.search(/nt4\.0/) ) !=
            -1) {
                        os[1]="nt4";
                    }

                    return os;
                } else if (brs.search(/linux/) !=-1) {
                    os[0]="linux";
                    try {
                        os[1] = brs.match(/linux\s?(\d+(\.?\d)*)/)[1];
                    } catch (e) { }
                    return os;
                } else if (brs.search(/mac\sos\sx/) !=-1) {
                    os[0]="macosx";
                    return os;
                } else if (brs.search(/freebsd/) !=-1) {
                    os[0]="freebsd";
                    try {
                        os[1] = brs.match(/freebsd\s(\d(\.\d)*)*/)[1];
                    } catch (e) { }
                    return os;
                } else if (brs.search(/sunos/) !=-1) {
                    os[0]="sunos";
                    try {
                        os[1]=brs.match(/sunos\s(\d(\.\d)*)*/)[1];
                    } catch (e) { }
                    return os;
                } else if (brs.search(/irix/) !=-1) {
                    os[0]="irix";
                    try {
                        os[1]=brs.match(/irix\s(\d(\.\d)*)*/)[1];
                    } catch (e) { }
                    return os;
                } else if (brs.search(/openbsd/) !=-1) {
                    os[0]="openbsd";
                    try {
                        os[1] = brs.match(/openbsd\s(\d(\.\d)*)*/)[1];
                    } catch (e) { }
                    return os;
                } else if ( (brs.search(/macintosh/) !=-1) || (brs.search(/mac\x5fpowerpc/)
            != -1) ) {
                    os[0]="macclassic";
                    return os;
                } else if (brs.search(/os\/2/) !=-1) {
                    os[0]="os2";
                    try {
                        os[1]=brs.match(/warp\s((\d(\.\d)*)*)/)[1];
                    } catch (e) { }
                    return os;
                } else if (brs.search(/openvms/) !=-1) {
                    os[0]="openvms";
                    try {
                        os[1]=brs.match(/openvms\sv((\d(\.\d)*)*)/)[1];
                    } catch (e)  { }
                    return os;
                } else if ( (brs.search(/amigaos/) !=-1) || (brs.search(/amiga/) != -1) ) {
                    os[0]="amigaos";
                    try {
                        os[1]=brs.match(/amigaos\s?(\d(\.\d)*)*/)[1];
                    } catch (e) { }
                    return os;
                } else if (brs.search(/hurd/) !=-1) {
                    os[0]="hurd";
                    return os;
                } else if (brs.search(/hp\-ux/) != -1) {
                    os[0]="hpux";
                    try {
                        os[1]=brs.match(/hp\-ux\sb\.[\/\s]?(\d+([\._]\d)*)/)[1];
                    } catch (e) { }
                    return os;
                } else if ( (brs.search(/unix/) !=-1) || (brs.search(/x11/) != -1 ) ) {
                    os[0]="unix";
                    return os;
                } else if (brs.search(/cygwin/) !=-1) {
                    os[0]="cygwin";
                    return os;
                } else if (brs.search(/java[\/\s]?(\d+([\._]\d)*)/) != -1) {
                    os[0]="java";
                    try {
                        os[1]=brs.match(/java[\/\s]?(\d+([\._]\d)*)/)[1];
                    } catch (e) { }
                    return os;
                } else if (brs.search(/palmos/) != -1) {
                    os[0]="palmos";
                    return os;
                } else if (brs.search(/symbian\s?os\/(\d+([\._]\d)*)/) != -1) {
                    os[0]="symbian";
                    try {
                        os[1]=brs.match(/symbian\s?os\/(\d+([\._]\d)*)/)[1];
                    } catch (e) { }
                    return os;
                } else {
                    os[0]="unknown";
                    return os;
                }
            }

            // Return Gecko version
            function getGeckoVersion() {
                return brs.match(/gecko\/([0-9]+)/)[1];
            }

            // Return MSIE version
            function getMSIEVersion() {
                return brs.match(/msie\s(\d+(\.?\d)*)/)[1];
            }

            // Return full browser UA string
            function getFullUAString(obj) {
                (isEmpty(obj) ? brs=navigator.userAgent.toLowerCase() : brs=obj);
                return brs;
            }

            // Is Flash plug-in installed?
            function hasFlashPlugin(obj) {

                (isEmpty(obj) ? brs=navigator.userAgent.toLowerCase() : brs=obj);

                var f=new Array("0", "0");
                var brwEng=getBrowser(obj)[2];
                var opSys=getOS(obj)[0]; 

                //if (getBrowser(obj)[2]!="msie") {
                if ( (brwEng=="gecko") || (brwEng=="opera") || (brwEng=="khtml") || (brwEng=="mozold") || (opSys=="macosx") || (opSys=="macclassic") ) {
                    // Non-IE Flash plug-in detection

                    if (navigator.plugins && navigator.plugins.length) {
                        x = navigator.plugins["Shockwave Flash"];
                        if (x) {
                            f[0] = 2;
                            if (x.description) {
                                y = x.description;
                                f[1] = y.charAt(y.indexOf('.')-1);
                            }
                        } else {
                            f[0] = 1;
                        }
                        if (navigator.plugins["Shockwave Flash 2.0"]) {
                            f[0] = 2;
                            f[0] = 2;
                        }
                    } else if (navigator.mimeTypes && navigator.mimeTypes.length) {
                        x = navigator.mimeTypes['application/x-shockwave-flash'];
                        if (x && x.enabledPlugin) {
                            f[0] = 2;
                        } else {
                            f[0] = 1;
                        }
                    }

               return f;

              } else if (brwEng=="msie") {
                  // IE flash detection.
                   for(var i=15; i>0; i--) {
                       try {
                           var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                           f[1] = i;
                           break;
                           //return;
                       } catch(e) { }
                   }

                   if (f[1]>0) {
                       f[0]=2
                   } else {
                       f[0]=1
                   }
               return f;
               } else {
                   f[0]=0;
                   f[1]=0;
                   return f;
               }
            }

            // Are pop-up windows allowed for this site? (i. e. has the user a pop-up blocker?)
            function popupsAllowed() {
                var allowed = false;
                var w = window.open("about:blank","","directories=no,height=1,width=1,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,left=0,top=0,location=no");
                if (w) {
                    allowed = true;
                    w.close();
                }
                return allowed;
            }

            function getJavascriptVersion() {

                window._b9j_jsVersion = 0.0;

                document.write('<script language="JavaScript1.0">');
                document.write('var _b9j_jsVersion=1.0;');
                document.write('<\/script>');

                document.write('<script language="JavaScript1.1">');
                document.write('var _b9j_jsVersion=1.1;');
                document.write('<\/script>');

                document.write('<script language="JavaScript1.2">');
                document.write('var _b9j_jsVersion=1.2;');
                document.write('<\/script>');

                document.write('<script language="JavaScript1.3">');
                document.write('var _b9j_jsVersion=1.3;');
                document.write('<\/script>');

                document.write('<script language="JavaScript1.4">');
                document.write('var _b9j_jsVersion=1.4;');
                document.write('<\/script>');

                document.write('<script language="JavaScript1.5">');
                document.write('var _b9j_jsVersion=1.5;');
                document.write('<\/script>');

                document.write('<script language="JavaScript1.6">');
                document.write('var _b9j_jsVersion=1.6;');
                document.write('<\/script>');

                document.write('<script language="JavaScript1.7">');
                document.write('var _b9j_jsVersion=1.7;');
                document.write('<\/script>');

                document.write('<script language="JavaScript1.8">');
                document.write('var _b9j_jsVersion=1.8;');
                document.write('<\/script>');

                document.write('<script language="JavaScript2.0">');
                document.write('var _b9j_jsVersion=2.0;');
                document.write('<\/script>');

            }

            function javascriptVersion() {
               _javascriptVersion(); 
               return window._b9j_jsVersion = 0.0;
            }

            /* FOR INTERNAL USE ONLY. THIS FUNCTIONS ARE SUBJECT TO CHANGE, DON'T TRUST THEM */
            // Is input empty?
            function isEmpty(input) {
                return (input==null || input =="")
            }

            // Does this string contain a dot?
            function hasDot(input) {
                return (input.search(/\./) == -1)
            }
}());

/*
 * =head1 SEE ALSO
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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
/* 
 * =head1 NAME
 * 
 * b9j.datetime.interval -
 *
 * =head1 DESCRIPTION
 *
 * =head1 METHODS
 *
 */

// http://www.zachleat.com/Lib/jquery/humane.js
// http://www.zachleat.com/web/2008/03/23/yet-another-pretty-date-javascript/
// http://deanlandolt.com/wp-content/uploads/humane.js
// http://deanlandolt.com/archives/163
// http://ejohn.org/blog/javascript-pretty-date/

(function(){

    var pckg = b9j.namespace.declare('b9j.datetime.interval');

    pckg.toLater = function(later) {
        return pckg.between(new Date(), later);
    };

    pckg.fromEarlier = function(earlier) {
        return pckg.between(earlier, new Date());
    };

    pckg.between = function(earlier, later) {
        return new pckg.Interval({ earlier: earlier, later: later });
    };

    pckg.Interval = function(given) {
        var earlier = given.earlier;
        var later = given.later;
        if ("object" != typeof earlier || ! b9j.isFunction(earlier.getTime))
            earlier = new Date(earlier);
        if ("object" != typeof later || ! b9j.isFunction(later.getTime))
            later = new Date(later);
        this._earlier = earlier.getTime();
        this._later = later.getTime();
        this._interval = this._later - this._earlier;
        this._absolute_interval = Math.abs(this._interval);
        this._inUnitValue = [];
    };

    var unitTable = [
        [ 0, 1000,                                 "second", "seconds" ],
        [ 1, 1000 * 60,                            "minute", "minutes" ],
        [ 2, 1000 * 60 * 60,                       "hour", "hours" ],
        [ 3, 1000 * 60 * 60 * 24,                  "day", "days" ],
        [ 4, 1000 * 60 * 60 * 24 * 7,              "week", "weeks" ],
        [ 5, 1000 * 60 * 60 * 24 * 7 * 4.5,        "month", "months" ],
        [ 6, 1000 * 60 * 60 * 24 * 7 * 365.2425,   "year", "years" ]
    ];

    pckg.Interval.prototype = {

        value: function(unit) {
            return this._inUnitValueFunction[unit].call(this);
        },

        _atMostFormat: function(atMost, least) {

            var interval = this._absolute_interval;

            if (interval < 1000)
                return 'just now';

            var suffix = ' ago';

            for (var ii = atMost; ii >= 0; ii--) {
                if (interval >= unitTable[ii][1]) {
                    var value = Math.floor(this.value(ii));
                    return value + " " + (value == 1 ? unitTable[ii][2] : unitTable[ii][3]) + suffix;
                }
            }

            if (b9j.isFunction(least)) {
                return least(this);
            }
            else if (b9j.isValue(least)) {
                return least;
            }
            else {
                return 'just now';
            }
        }
    };

    pckg.Interval.prototype._inUnitValueFunction = [];
    for (var ii = 0; ii < unitTable.length; ii++) {
        (function(){

            var unit = ii;
            var unitDivisor = unitTable[unit][1];

            var inUnitValueFunction = function() {
                if (null != this._inUnitValue[unit])
                    return this._inUnitValue[unit];
                return this._inUnitValue[unit] = this._absolute_interval / unitDivisor;
            };

            pckg.Interval.prototype[unitTable[ii][2] + "Value"] = inUnitValueFunction;
            pckg.Interval.prototype._inUnitValueFunction[ii] = inUnitValueFunction;

            var atMostFunction = function() {
                return this._atMostFormat(unit);
            };

            pckg.Interval.prototype[unitTable[ii][2] + "AtMostFormat"] = atMostFunction;;

        }());
    }

}());

/*
 * =head1 SEE ALSO
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
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
