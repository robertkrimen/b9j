/* 
 * =head1 NAME
 * 
 * b9j.test.smoke -
 *
 * =head1 SYNPOSIS 
 *  
 * =head1 DESCRIPTION
 *  
 * =head1 METHODS
 *
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

(function(){

    var pckg = b9j.namespace.declare('b9j.test.smoke');

    pckg.report = function(b9jReport) {

//        report.test_name = null;
//        report.test_author = null;

        var report = {};
        report.total = b9jReport.total;
        report.failed = b9jReport.failed;

        var reporter = b9j.environment.detect();
            
        for (key in reporter) {
            report["reporter_" + key] = reporter[key];
        }
        report.url = window.location.href;

        var toURI;
        toURI = "http://localhost:8080/api/test/report/submit/";
        toURI = "http://browsersmoke.appspot.com/api/test/report/submit/";
        b9j.chunker.send(toURI + "chunker", report);
        b9j.chunker.send(toURI + "chunker", report);

    };

    pckg._TestRunner_COMPLETE_EVENT = function(b9jReport) {
        var uri = b9j.uri.location();
        if (uri.query().get().b9jSmoke) {
            b9j.test.smoke.report(b9jReport);
        }
    };

}());
