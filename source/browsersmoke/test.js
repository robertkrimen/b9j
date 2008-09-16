b9j.browsersmoke.report({

    test_name: "browsersmoke-test",

    b9jTest: function(test) {
        test.areEqual("xyzzy", "xyzzy");
        test.areNotEqual("xyzzy", "banana");
//        test.like(/xyzzy/, "applexyzzy");
//        test.unlike(/xyzzy/, "banana");
//        test.like(/xyzzy/, "banana");
//        var count = 2;
//        while (count--)
//            test.is(b9j.random.generate64(), b9j.random.generate64());
    }

});

