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

    function assertionToTest(test) {
        return function() {
            this._beginTest();
            var error;
            try {
                test.apply(YuA, arguments);
            }
            catch (thrown) {
                if (! thrown instanceof YAHOO.util.AssertionError) throw(thrown);
                error = thrown;
            }
            this._endTest(error);
            return error ? false : true;
        };
    }

    var pckg = b9j.namespace.declare('b9j.test');

    pckg.b9jTest = function(testRunner, reportHandler) {

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
                    testRunner(tester);
                    tester._doneTesting(this);
                }

            }));    

            if (reportHandler) {
                TestRunner.subscribe(TestRunner.COMPLETE_EVENT, function (result) {
                    reportHandler(tester._report(), result);
                });
            }

            TestRunner.subscribe(TestRunner.COMPLETE_EVENT, function (result) {
                b9j.test.smoke._TestRunner_COMPLETE_EVENT(tester._report(), result);
            });

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

        _doneTesting: function(testCase) {
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

            return { total: total, pass: pass, fail: fail, failed: failed };
        }

    };

    pckg._build_Tester = function() {

        var Yl = YAHOO.lang;
        var Yu = YAHOO.util;
        var YuA = YAHOO.util.Assert;
        var TestRunner = YAHOO.tool.TestRunner;

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
