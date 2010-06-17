var ran = false;
b9j.test.b9jTest(function(test) {
    test.areEqual("xyzzy", "xyzzy");
    test.areNotEqual("xyzzy", "banana");
    test.like(/xyzzy/, "applexyzzy");
    test.unlike(/xyzzy/, "banana");
}, function(report) {
    if (ran)
        return;
    ran = true;
    b9j.test.b9jTest(function(test) {
        test.isNumber(report.benchmark_time);
    });
});
