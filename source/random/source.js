/* 
 * =head1 NAME
 * 
 * b9j.random - Generate pseudo-random binary-string, hexadecimal, or base64 data of arbritrary length
 *
 * =head1 SYNOPSIS 
 *
 *      var result
 *
 *      result = b9j.random.generate() 
 *      // result is a random binary string (base256) of length 32 
 *
 *      result = b9j.random.generate64(4) 
 *      // result is a random base64 (truncated) string of length 4
 *
 *      result = b9j.random.generate16(121) 
 *      // result is a random hexadecimal string (base16, truncated) of length 121
 *
 * =head1 DESCRIPTION
 *
 * Generate pseudo-random binary, hexadecimal, or base64 data of arbritrary length
 *
 * The generator has two parts: the seeder and the digester.  The seeder is basically:
 *
 *     "" + ++<counter> + Math.random() + new Date().getTime()
 *
 * The digester is [b9j.digest.sha256](http://appengine.bravo9.com/b9j/documentation/digest.sha256.html), which
 * takes the resulting seed and makes it look "obscure" by calculating the SHA-256 digest of it.
 *
 * =head1 METHODS
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.random');

    pckg._seederCounter = b9j.random._seederCounter ||  0;
    pckg._seeder = function() {
        return "" + ++b9j.random._seederCounter + Math.random() + new Date().getTime();
    };

    pckg._create16 = function() {
        return b9j.digest.sha256.calculate16( b9j.random._seeder() );
    };

    pckg._create64 = function() {
        return b9j.digest.sha256.calculate64( b9j.random._seeder() );
    };

    pckg._create256 = function() {
        return b9j.digest.sha256.calculate256( b9j.random._seeder() );
    };

    pckg._create = function(method, length) {

        if (! length)
            return method();

        var result = "";
        while (result.length < length) {
            result += method();
        }

        return result.substr(0, length);

    };

/*
 * =head2 generate( [ $length ] )
 *
 * =head2 generate256( [ $length ] )
 *
 * =head2 generateBase256( [ $length ] )
 *
 * Returns a pseudo-random binary string (base 256) of length $length
 *
 * If $length is not given, then it defaults to 32
 *
 */
    pckg.generate = function(length) {
        return b9j.random._create(b9j.random._create256, length);
    };

    pckg.generate256 = pckg.generateBase256 = function() {
        return b9j.random.generate.apply(this, arguments);
    };
/*
 * =head2 generate16( [ $length ] )
 *
 * =head2 generateHexadecimal( [ $length ] )
 *
 * =head2 generateHex( [ $length ] )
 *
 * =head2 generateBase16( [ $length ] )
 *
 * Returns a pseudo-random hexadecimal (base16) string of length $length
 *
 * If $length is not given, then it defaults to 64
 *
 */
    pckg.generate16 = function(length) {
        return b9j.random._create(b9j.random._create16, length);
    };

    pckg.generateHexadecimal = pckg.generateHex = pckg.generateBase16 = function() {
        return b9j.random.generate16.apply(this, arguments);
    };

/*
 * =head2 generate64( [ $length ] )
 *
 * =head2 generateBase64( [ $length ] )
 *
 * Returns a pseudo-random base64 string of length $length
 *
 * If $length is not given, then it defaults to 44
 *
 */

    pckg.generate64 = function(length) {
        return b9j.random._create(b9j.random._create64, length);
    };

    pckg.generateBase64 = function() {
        return b9j.random.generate64.apply(this, arguments);
    };

}());

/*
 * =head1 SEE ALSO
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
