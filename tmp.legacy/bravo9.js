if (YAHOO == undefined) {
    var YAHOO = {
        bravo9: {
            age: {},
        },
    };
}
else {
    YAHOO.namespace("bravo9.age");
}

(function(){

    var Age = YAHOO.bravo9.age;
    var level = {
        seconds: 1,
        second: 1,

        minutes: 2,
        minute: 2,

        hours: 3,
        hour: 3,

        days: 4,
        day: 4,

        weeks: 5,
        week: 5,

        months: 6,
        month: 6,

        years: 7,
        year: 7,
    };

    Age.difference = function(from, to) {
        return (to - from);
    };

    Age.interval = function(from, to) {
        return new Age.Interval(Age.difference(from, to));
    };

    Age.age = function(from, to, given) {
        return new Age.Interval(Age.difference(from, to)).age(given);
    };

    Age.Interval = function(interval) {
        this.interval = interval;
    };
    Age.Interval.prototype = {

        second: function() {
            return this.interval / 1000;
        },

        minute: function() {
            return this.second() / 60;
        },

        hour: function() {
            return this.minute() / 60;
        },

        day: function() {
            return this.hour() / 24;
        },

        week: function() {
            return this.day() / 7;
        },

        month: function() {
            return this.week() / 4;
        },

        year: function() {
            return this.day() / 365.2425;
        },

        _format: function(value, measure) {
            return value + " " + measure + (value == 1 ? "" : "s");
        },

        age: function(given) {

            return this.age_year_and_below();

            if (! given) return this.age_year_and_below();

            var top = given.top;
            if (top) {
                top = level[top];
            }
            else {
                top = 0;
            }

            var bottom = given.bottom;
            if (bottom) {
                bottom = level[bottom];
            }
            else {
                bottom = 0;
            }

            if (! top && ! bottom) return this.age_year_and_below();

            var value;

            if (bottom && bottom == level["year"]) {
                return this._format(this.year(), "year");
            }

            if (! top || top >= level["year"]) {
                if (value = parseInt(this.year())) {
                    return this._format(value, "year");
                }
            }

            if (bottom && bottom == level["week"]) {
                return this._format(this.day(), "week");
            }

            if (! top || top >= level["week"]) {
                if (value = parseInt(this.day())) {
                    return this._format(value, "week");
                }
            }

            if (bottom && bottom == level["day"]) {
                return this._format(this.day(), "day");
            }

            if (! top || top >= level["day"]) {
                if (value = parseInt(this.day())) {
                    return this._format(value, "day");
                }
            }

        },

        age_year_and_below: function() {

            var value;

            if (value = parseInt(this.year())) {
                return this._format(value, "year");
            }
                
            if (value = parseInt(this.month())) {
                return this._format(value, "month");
            }

            return this.age_week_and_below();
            
        },

        age_week_and_below: function() {

            if (value = parseInt(this.week())) {
                return this._format(value, "week");
            }
                
            if (value = parseInt(this.day())) {
                return this._format(value, "day");
            }

            if (value = parseInt(this.hour())) {
                return this._format(value, "hour");
            }

            if (value = parseInt(this.minute())) {
                return this._format(value, "minute");
            }

            if (value = parseInt(this.second())) {
                return this._format(value, "second");
            }

            return null;
        },

    };

}());
