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
