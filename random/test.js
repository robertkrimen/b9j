b9jTest(function(test) {

    var result;

    result = b9j.random.generateHex();
    test.is(result.length, 64);

    result = b9j.random.generateHex(1);
    test.is(result.length, 1);

    result = b9j.random.generateHex(2);
    test.is(result.length, 2);

    result = b9j.random.generateHex(128);
    test.is(result.length, 128);

    result = b9j.random.generate16();
    test.is(result.length, 64);

    result = b9j.random.generate16(1);
    test.is(result.length, 1);

    result = b9j.random.generate16(2);
    test.is(result.length, 2);

    result = b9j.random.generate16(128);
    test.is(result.length, 128);


    result = b9j.random.generateBase64();
    test.is(result.length, 44);

    result = b9j.random.generateBase64(1);
    test.is(result.length, 1);

    result = b9j.random.generateBase64(2);
    test.is(result.length, 2);

    result = b9j.random.generateBase64(128);
    test.is(result.length, 128);

    result = b9j.random.generate64();
    test.is(result.length, 44);

    result = b9j.random.generate64(1);
    test.is(result.length, 1);

    result = b9j.random.generate64(2);
    test.is(result.length, 2);

    result = b9j.random.generate64(128);
    test.is(result.length, 128);


    result = b9j.random.generate();
    test.is(result.length, 32);

    result = b9j.random.generate(1);
    test.is(result.length, 1);

    result = b9j.random.generate(2);
    test.is(result.length, 2);

    result = b9j.random.generate(128);
    test.is(result.length, 128);
});
