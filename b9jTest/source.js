/* 
 *
 * =head1 NAME
 * 
 * b9jTest
 *
 * =head1 SYNOPSIS 
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
 * =head2 b9jTest( $function )
 *
 * Run the given $function with a b9j.test.Tester object as the first argument
 *
 *         b9jTest(function(test) {
 *
 *             test.areEqual( ... )
 *             ...
 *
 *         });
 *
 * =head1 Test functions
 *
 * The following test functions are available on the b9j.test.Tester object
 *
 * Most of these are wrappers around the functions found in the [YAHOO.util.Assert](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html) package. A
 * detailed description of their workings can be found at: [http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html](http://developer.yahoo.com/yui/docs/YAHOO.util.Assert.html)
 *
 *
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
 */

function b9jTest(given) {
    b9j.test.simple(given);
}
