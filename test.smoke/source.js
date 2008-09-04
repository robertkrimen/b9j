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

        var $ua = YAHOO.env.ua;
        var bv, b;
        var report = {};
        if (0)
            ;
        else if ((bv = $ua.air) > 0) b = "air";
        else if ((bv = $ua.gecko) > 0) b = "gecko";
        else if ((bv = $ua.ie) > 0) b = "ie";
        else if ((bv = $ua.opera) > 0) b = "opera";
        else if ((bv = $ua.webkit) > 0) b = "webkit";
        else {
            b = "unknown";
            bv = 0;
        }
            
//        report.test_name = null;
//        report.test_author = null;

        report.total = b9jReport.total;
        report.failed = b9jReport.failed;
        report.reporter_user_agent = navigator.userAgent;
        report.reporter_user_agent_browser = b;
        report.reporter_user_agent_browser_version = bv;
        report.reporter_user_agent_mobile = $ua.mobile;
        report.reporter_url = window.location.href;

        var toURI;
        toURI = "http://localhost:8080/api/report/submit/";
        toURI = "http://browsersmoke.appspot.com/api/report/submit/";
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
