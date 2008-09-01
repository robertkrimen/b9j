b9j.test.smoke.b9jSmoke(function(test) {
    test.areEqual("xyzzy", "xyzzy");
    test.areNotEqual("xyzzy", "banana");
    test.like(/xyzzy/, "applexyzzy");
    test.unlike(/xyzzy/, "banana");
    test.like(/xyzzy/, "banana");
});
