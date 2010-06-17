b9jTest(function(test) {

    test.is(3, Math.floor(b9j.datetime.interval.fromEarlier(new Date() - 3000).value(0)));
    test.is(3, Math.floor(b9j.datetime.interval.fromEarlier(new Date() - 3000).secondValue()));
    test.is("3 seconds", b9j.datetime.interval.fromEarlier(new Date() - 3000).yearAtMostFormat());
    test.is("3 minutes", b9j.datetime.interval.fromEarlier(new Date() - 3000 * 60).yearAtMostFormat());
    test.is("1 hour", b9j.datetime.interval.fromEarlier(new Date() - 1000 * 60 * 60).yearAtMostFormat());
    test.is("1 minute",
        b9j.datetime.interval.between(
            new Date("Sun, 07 Sep 2008 05:12:26 GMT"),
            new Date("Sat Sep 06 2008 22:13:37 GMT-0700")).yearAtMostFormat());
    test.is("34 weeks",
        b9j.datetime.interval.between(
            new Date("Sun Jan 06 2008 22:13:37 GMT-0700"),
            new Date("Sun, 07 Sep 2008 05:12:26 GMT")).weekAtMostFormat());
    test.is("34 weeks",
        b9j.datetime.interval.between(
            new Date("Sun, 07 Sep 2008 05:12:26 GMT"),
            new Date("Sun Jan 06 2008 22:13:37 GMT-0700")).weekAtMostFormat());

//    console.log(new Date("2008/09/06 23:02:00"));
//    console.log(new Date("2008/09/06 23:02:00 UTC"));
    
});
