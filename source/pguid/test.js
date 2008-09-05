b9jTest(function(test) {

    var sequence, pguid;

    sequence = new b9j.pguid.Sequence();
    test.isObject(sequence);

    pguid = sequence.next();
    test.isString(pguid);
    test.like(/^pguid-.*-0$/, pguid);

    pguid = sequence.next();
    test.like(/^pguid-.*-1$/, pguid);

    pguid = sequence.next();
    test.like(/^pguid-.*-2$/, pguid);

    var count = 2;
    while (count++ < 1024) {
        pguid = sequence.next();
        if (! pguid.match(new RegExp("^pguid-.*-" + count + "$"))) {
            test.fail(pguid + " does not correspond to " + count);
            break;
        }
    }

    sequence = new b9j.pguid.Sequence({ namespace: "mine", start: 3 });
    test.isObject(sequence);

    pguid = sequence.next();
    test.like(/^mine-.*-3$/, pguid);

    pguid = b9j.pguid.sequence().next();
    test.like(/^b9j-pguid-.*-0$/, pguid);

    pguid = b9j.pguid.next();
    test.like(/^b9j-pguid-.*-1$/, pguid);

    pguid = b9j.pguid.next();
    test.like(/^b9j-pguid-.*-2$/, pguid);

});
