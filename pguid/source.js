/* 
 * =head1 NAME
 * 
 * b9j.pguid - Page-unique identifier generation
 *
 * =head1 SYNOPSIS 
 *
 *      pguid = b9j.pguid.next() // A unique id (suitable for an Element) is generated
 *      print( pguid) // Something like "b9j-pguid-20a9ff-0"
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
 * be bothered to dream up a custom one (every time). 
 *
 * =head1 METHODS
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.pguid');
    var clss;

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

    var singleton;

/*
 * =head2 b9j.pguid.sequence()
 *
 * Returns the b9j.pguid sequence singleton, which is configured with the
 * namespace "b9j-pguid"
 *
 */
    pckg.sequence = function() {
        if (singleton) return singleton;
        return singleton = new b9j.pguid.Sequence({ namespace: "b9j-pguid" });
    };

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
