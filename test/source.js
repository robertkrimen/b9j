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
                    tester.done();
                }

            }));    

            YAHOO.tool.TestRunner.run();
        });
    };

    pckg.Tester = function() {
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
            }
        },

        done: function() {
            if (this._errors.length)
                YAHOO.util.Assert.fail("Failed " + this._errors.length + " tests out of " + this._tests);
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
    }
    
}());
