/* 
 *
 * =head1 NAME
 * 
 * b9jTest - A wrapper around YUI Test to make simple testing quick and easy
 *
 * =head1 SYNOPSIS 
 *  
 *     b9jTest(function(test) {
 *
 *         test.areEqual("xyzzy", "xyzzy");
 *         test.areEqual("apple", "apple");
 *         test.like(/banana/, "banana");
 *
 *     });
 *
 * =head1 DESCRIPTION
 *
 * b9jTest is a convenience package for running tests. It is comprised
 * of b9jTest.js and b9jTest.css, which include every YUI and b9j component you need
 * to run tests.
 *
 * =head1 DOWNLOAD
 *
 * * [b9jTest.js](http://appengine.bravo9.com/b9j/b9jTest.js)
 *
 * * [b9jTest.css](http://appengine.bravo9.com/b9j/b9jTest.css)
 *
 * =head1 Example HTML test document
 *
 * The following is a functioning example of b9jTest in action:
 *
 *         <html>
 *         <head>
 *             <meta http-equiv="content-type" content="text/html; charset=utf-8">
 *         <title>b9jTest example</title>
 *         <link rel="stylesheet" type="text/css" href="http://appengine.bravo9.com/b9j/b9jTest.css">
 *         <script type="text/javascript" src="http://appengine.bravo9.com/b9j/b9jTest.js"></script>
 *         </head>
 *         <body class="yui-skin-sam">
 *         <div id="testLogger"></div>
 *         <script type="text/javascript">
 *         
 *             b9jTest(function(test) {
 *                 test.areEqual("xyzzy", "xyzzy");
 *                 test.areEqual("apple", "apple");
 *                 test.like(/banana/, "banana");
 *             });
 *         
 *         </script>
 *         </body>
 *         </html>
 *
 * Try this example: [http://appengine.bravo9.com/b9j/documentation/b9jTest-example.html](http://appengine.bravo9.com/b9j/documentation/b9jTest-example.html)
 *
 * =head1 METHODS
 *
 * =head2 b9jTest( $function )
 *
 * Run the given $function with a tester object as the first argument
 *
 *         b9jTest(function(test) {
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
 *             b9jTest(function(test) {
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
 * =head1 AUTHOR
 *
 * Robert Krimen, `<robertkrimen at gmail.com>`
 *
 * =head1 SOURCE
 *
 * You can contribute or fork this project via GitHub:
 *
 * http://github.com/robertkrimen/b9j/tree/master
 *
 *          git clone git://github.com/robertkrimen/b9j.git
 *
 * =head1 COPYRIGHT & LICENSE
 *
 * Copyright 2008 Robert Krimen
 *
 * This program is free software; you can redistribute it and/or modify it under the same terms as Perl.
 *
 */

function b9jTest(given) {
    b9j.test.b9jTest(given);
}
