/* 
 * =head1 NAME
 * 
 * b9j.namespace - Create and use namespaces
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
 * [higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing](http://higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing) (by Karl Krukow)
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
 * [higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing](http://higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing)
 *
 */

(function(){

    // 'use' adapted from work by Karl Krukow
    // http://higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing

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
