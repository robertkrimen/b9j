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
 */

function b9jTest(given) {
    b9j.test.simple(given);
}
