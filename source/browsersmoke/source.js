/* 
 * =head1 NAME
 * 
 * b9j.browsersmoke -
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

    var pckg = b9j.namespace.declare('b9j.browsersmoke');

    pckg.report = function(given) {

        var report = {};

        var reporter = b9j.environment.detect();
        for (key in reporter) {
            report["reporter_" + key] = reporter[key];
        }

        report.location = window.location.href;

        var to;
        to = "http://localhost:8080/api/test/report/submit/";
        to = "http://browsersmoke.appspot.com/api/test/report/submit/";
        to += "chunker";
        report.to = to;

        if (given.test) {
            if (b9j.isFunction(given.test)) { // given.test = function() ...
                try {
                    gotten = given.test(report);
                    if (gotten)
                        report = b9j.merge(report, gotten)
                }
                catch (thrown) {
                    report.result = "unknown";
                }
            }
            else {
                throw "b9j.browsersmoke.report: Don't understand .test " + given.test;
            }
            delete given.test;
        }
        else if (given.b9jTest) {
            var b9jTest = given.b9jTest;
            delete given.b9jTest;
            if (b9j.isFunction(b9jTest)) { // given.b9jTest = function() ...
                try {
                    b9j.test.b9jTest(b9jTest, function (b9jTestReport){
                        report.total = b9jTestReport.total;
                        report.fail = b9jTestReport.fail ? b9jTestReport.failed : 0;
                        pckg.submitReport(given, report);
                    });
                    return;
                }
                catch (thrown) {
                    report.result = "unknown";
                    pckg.submitReport(given, report);
                }
            }
            else {
                throw "b9j.browsersmoke.report: Don't understand .b9jTest " + b9jTest;
            }
        }

        pckg.submitReport(given, report);

//        if (b9j.isString(report_)) { // report_ = ~...
//            report.test = report_
//        }
//        else if (b9j.isFunction(report_)) { // report_ = function() ...
//            var gotten = report_(report);
//            if (gotten)
//                report = gotten;
//        }
//        else if (b9j.isObject(report_)) { // report_ = { ... }
//            report = b9j.merge(report, report_)
//        }
//        else {
//            throw "b9j.browsersmoke.report: Don't understand report " + report_;
//        }

    };

    pckg.submitReport = function(given, report) {

        var filter = given.filter;
        delete given.filter;

        report = b9j.merge(report, given)

        if (filter) {
            if (b9j.isFunction(filter)) { // filter = function() ...
                var gotten = filter(report);
                if (gotten)
                    report = gotten;
            }
            else {
                throw "b9j.browsersmoke.report: Don't understand filter " + filter;
            }
        }

        var to = report.to;
        delete report.to;

        b9j.chunker.send(to, report);
    };


//    pckg._TestRunner_COMPLETE_EVENT = function(report_) {
//        var uri = b9j.uri.location();
//        if (uri.query().get().b9jSmoke) {
//            b9j.browsersmoke.report(report_);
//        }
//    };

}());
