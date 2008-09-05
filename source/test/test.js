    b9j.test.b9jTest(function(test) {
        test.areEqual("xyzzy", "xyzzy");
        test.areNotEqual("xyzzy", "banana");
        test.like(/xyzzy/, "applexyzzy");
        test.unlike(/xyzzy/, "banana");
    });

