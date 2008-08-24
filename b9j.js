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
                    if (namespace.hasOwnPropery(ii)) {
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
(function(){

    // 'use' adapted from work by Karl Krukow
    // http://higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing

    var pckg = b9j._namespace('b9j.namespace');

    pckg.use = function() {
        return {
            run: function(inner) {
                return inner.apply(arguments[0],arguments);
            }
         };
    };
    pckg.using = pckg.use;

    pckg.namespaceRE = b9j._namespaceRE;
    pckg.namespace = b9j._namespace;
    pckg.declare = b9j._namespace;

}());
/* 
 *
 * =head1 NAME
 * 
 * b9j.test
 *
 * =head1 SYNPOSIS 
 *  
 *     b9j.test.simple(function(test) {
 *
 *         test.areEqual("xyzzy", "xyzzy");
 *         test.areEqual("this", "that");
 *
 *     });
 *  
 * =head1 DESCRIPTION
 *  
 * b9j.test is a wrapper around the YUI test system providing Test::More-like feedback
 *  
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.test');

    pckg.simple = function(given) {

        YAHOO.util.Event.onDOMReady(function(){

            var logger = new YAHOO.tool.TestLogger("testLogger");

            var name, setUp, tearDown;
            name = "Simple";
            
            var tester = new b9j.test.Tester();

            YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({

                name: name,

                testSimple: function() {
                    given(tester);
                    tester.done(this);
                }

            }));    

            YAHOO.tool.TestRunner.run();
        });
    };

    pckg.Tester = function(given) {
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
                YAHOO.log("fail " + this._test + ":\n" + error, "info", "TestRunner");
            }
            else {
                YAHOO.log("pass " + this._test, "info", "TestRunner");
            }
        },

        done: function(testCase) {
            YAHOO.log(testCase.name + ": " + "Passed:" + (this._tests - this._errors.length) + " Failed:" + this._errors.length + " Total:" + this._tests, "info", "TestRunner");
            if (this._errors.length)
                YAHOO.util.Assert.fail("FAIL " + this._errors.length + " / " + this._tests);
        }
    };

    var _test = [
'areEqual',
'areNotEqual',
'areNotSame',
'areSame',
'fail',
'isArray',
'isBoolean',
'isFalse',
'isFunction',
'isInstanceOf',
'isNaN',
'isNotNaN',
'isNotNull',
'isNotUndefined',
'isNull',
'isNumber',
'isObject',
'isString',
'isTrue',
'isTypeOf',
'isUndefined'
    ];

    for (ii = 0; ii < _test.length; ii++) {
        var name = _test[ii];
        (function(name){
            pckg.Tester.prototype[name] = function() {
                this._beginTest();
                var error;
                try {
                    YAHOO.util.Assert[name].apply(YAHOO.util.Assert, arguments);
                }
                catch (thrown) {
                    if (! thrown instanceof YAHOO.util.AssertionError) throw(thrown);
                    error = thrown;
                }
                this._endTest(error);
                return error ? false : true;
            };
        }(name));
    }

    pckg.TesterView = function() {
        this.panel = new YAHOO.widget.Panel(
                "panel", // The element id
                {
                        width: "480px",
                        fixedcenter: true,
                        close: false,
                        draggable: false,
                        zindex: 4,
                        modal: true,
                        visible: false
                }
        );
        this.panel.setBody("<p>Aliquam ultrices. Nulla dictum, augue et condimentum commodo.</p>");
        this.panel.render(document.body);
        this.panel.show();
    };

    pckg.TesterView.prototype = {

        passTest: function(number) {
            this.panel.body.innerHTML += "<p>ok........." + number + "</p>";
        },

        failTest: function(number, error) {
            this.panel.body.innerHTML += "<p>fail......." + number + "</p>";
        }

    };

}());
(function(){

    var pckg = b9j.namespace.declare('b9j.path');

    pckg.canonical = function(path) {
        return "blah";
    };
    
}());
/* 
 *
 * =head1 NAME
 * 
 * b9jTest
 *
 * =head1 SYNPOSIS 
 *  
 *     b9jTest(function(test) {
 *
 *         test.areEqual("xyzzy", "xyzzy");
 *         test.areEqual("this", "that");
 *
 *     });
 *
 * =head1 DESCRIPTION
 *
 * b9jTest is a convenience package for running tests. It is comprised
 * of b9jTest.js and b9jTest.css, which include every YUI and b9j dependency you need
 * to run tests.
 *
 * =head1 METHODS
 *
 * =head2 b9jTest( `<function>` )
 *
 * Run the given `<function>` with a b9j.test.Tester object as the first argument
 *
 *         b9jTest(function(test) {
 *
 *             test.areEqual( ... )
 *             ...
 *
 *         });
 *
 */

function b9jTest(given) {
    b9j.test.simple(given);
}
