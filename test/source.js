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
