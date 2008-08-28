b9jTest(function(test) {

    var parse = b9j.uri.parse;
    var uri;

    {
        uri = parse("http://example.com");
        test.is("http", uri.protocol);
        test.is("example.com", uri.host);

    }

});
