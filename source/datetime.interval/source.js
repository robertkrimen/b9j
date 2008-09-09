/* 
 * =head1 NAME
 * 
 * b9j.datetime.interval -
 *
 * =head1 DESCRIPTION
 *
 * =head1 METHODS
 *
 */

//http://www.zachleat.com/Lib/jquery/humane.js
//http://www.zachleat.com/web/2008/03/23/yet-another-pretty-date-javascript/
//http://deanlandolt.com/wp-content/uploads/humane.js
//http://deanlandolt.com/archives/163
//http://ejohn.org/blog/javascript-pretty-date/

(function(){

    var pckg = b9j.namespace.declare('b9j.datetime.interval');

    pckg.toLater = function(later) {
        return pckg.between(new Date(), later);
    };

    pckg.fromEarlier = function(earlier) {
        return pckg.between(earlier, new Date());
    };

    pckg.between = function(earlier, later) {
        return new pckg.Interval({ earlier: earlier, later: later });
    };

    pckg.Interval = function(given) {
        var earlier = given.earlier;
        var later = given.later;
        if ("object" != typeof earlier || ! b9j.isFunction(earlier.getTime))
            earlier = new Date(earlier);
        if ("object" != typeof later || ! b9j.isFunction(later.getTime))
            later = new Date(later);
        this._earlier = earlier.getTime();
        this._later = later.getTime();
        this._interval = this._later - this._earlier;
        this._absolute_interval = Math.abs(this._interval);
        this._inUnitValue = [];
    };

    var unitTable = [
        [ 0, 1000,                                 "second", "seconds" ],
        [ 1, 1000 * 60,                            "minute", "minutes" ],
        [ 2, 1000 * 60 * 60,                       "hour", "hours" ],
        [ 3, 1000 * 60 * 60 * 24,                  "day", "days" ],
        [ 4, 1000 * 60 * 60 * 24 * 7,              "week", "weeks" ],
        [ 5, 1000 * 60 * 60 * 24 * 7 * 4.5,        "month", "months" ],
        [ 6, 1000 * 60 * 60 * 24 * 7 * 365.2425,   "year", "years" ]
    ];

    pckg.Interval.prototype = {

        value: function(unit) {
            return this._inUnitValueFunction[unit].call(this);
        },

        _atMostFormat: function(atMost, least) {

            var interval = this._absolute_interval;

            for (var ii = atMost; ii >= 0; ii--) {
                if (interval >= unitTable[ii][1]) {
                    var value = Math.floor(this.value(ii));
                    return value + " " + (value == 1 ? unitTable[ii][2] : unitTable[ii][3]);
                }
            }

            if (b9j.isFunction(least)) {
                return least(this);
            }
            else if (b9j.isValue(least)) {
                return least;
            }
            else {
                return "now";
            }
        }
    };

    pckg.Interval.prototype._inUnitValueFunction = [];
    for (var ii = 0; ii < unitTable.length; ii++) {
        (function(){

            var unit = ii;
            var unitDivisor = unitTable[unit][1];

            var inUnitValueFunction = function() {
                if (null != this._inUnitValue[unit])
                    return this._inUnitValue[unit];
                return this._inUnitValue[unit] = this._absolute_interval / unitDivisor;
            };

            pckg.Interval.prototype[unitTable[ii][2] + "Value"] = inUnitValueFunction;
            pckg.Interval.prototype._inUnitValueFunction[ii] = inUnitValueFunction;

            var atMostFunction = function() {
                return this._atMostFormat(unit);
            };

            pckg.Interval.prototype[unitTable[ii][2] + "AtMostFormat"] = atMostFunction;;

        }());
    }

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
