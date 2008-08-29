function _testURI(test) {

    var parse = b9j.uri.parse;
    var base, uri;

    {
        uri = parse("http://example.com");
        test.is("http", uri.protocol);
        test.is("example.com", uri.host);
    }

    {
        uri = new b9j.uri.URI("http://example.com");
        test.is("http://example.com", uri);
        var uriClone = uri.clone();
        test.is("http://example.com", uriClone);
        uriClone.port(80);
        test.is("http://example.com:80", uriClone);
        test.is("http://example.com", uri);

        uri = new b9j.uri.URI("http://example.com?a=1&b=2");
        test.is("http://example.com?a=1&b=2", uri);
        var uriClone = uri.clone();
        test.is("http://example.com?a=1&b=2", uriClone);
        uriClone.query().set("b", 3);
        uriClone.query().set("c", 4);
        test.is("http://example.com?a=1&b=3&c=4", uriClone);
        test.is("http://example.com?a=1&b=2", uri);
    }

    {
        uri = new b9j.uri.URI("http://example.com");
        test.is("http://example.com", uri);
    
        uri.down("a", "b");
        test.is("http://example.com/a/b", uri);

        uri.down("c/");
        test.is("http://example.com/a/b/c/", uri);
    }

    uri = base = new b9j.uri.URI("http://user:password@example.com:80/path/?a=1&b=2&c=3&c=4&c=5#fragment");
    test.is("http://user:password@example.com:80/path/?a=1&b=2&c=3&c=4&c=5#fragment", uri);
    test.is("http", uri.protocol());
    test.is("user:password@example.com:80", uri.authority());
    test.is("user", uri.user());
    test.is("password", uri.password());
    test.is("user:password", uri.userInformation());
    test.is("example.com", uri.host());
    test.is("80", uri.port());
    test.is("/path/", uri.path());
    test.is("a=1&b=2&c=3&c=4&c=5", uri.query());
    test.is("fragment", uri.fragment());

    {
        uri = base.clone();
        uri.authority("alice:xyzzy@example.net:8080");
        test.is("http://alice:xyzzy@example.net:8080/path/?a=1&b=2&c=3&c=4&c=5#fragment", uri);
        test.is("alice", uri.user());
        test.is("xyzzy", uri.password());
        test.is("alice:xyzzy", uri.userInformation());
        test.is("example.net", uri.host());
        test.is("8080", uri.port());
    }

    {
        uri = base.clone();
        uri.userInformation("alice:xyzzy");
        test.is("http://alice:xyzzy@example.com:80/path/?a=1&b=2&c=3&c=4&c=5#fragment", uri);
        test.is("alice", uri.user());
        test.is("xyzzy", uri.password());
    }

    {
        uri = base.clone();
        uri.user("alice");
        test.is("http://alice:password@example.com:80/path/?a=1&b=2&c=3&c=4&c=5#fragment", uri);
    }

    {
        uri = base.clone();
        uri.password("xyzzy");
        test.is("http://user:xyzzy@example.com:80/path/?a=1&b=2&c=3&c=4&c=5#fragment", uri);
    }

    {
        uri = base.clone();
        uri.host("example.net");
        test.is("http://user:password@example.net:80/path/?a=1&b=2&c=3&c=4&c=5#fragment", uri);
    }

    {
        uri = base.clone();
        uri.port(8080);
        test.is("http://user:password@example.com:8080/path/?a=1&b=2&c=3&c=4&c=5#fragment", uri);
    }

    {
        uri = base.clone();
        uri.fragment("top");
        test.is("http://user:password@example.com:80/path/?a=1&b=2&c=3&c=4&c=5#top", uri);
    }

    {
        uri = base.clone();
        uri.path("/a/b/c");
        test.is("http://user:password@example.com:80/a/b/c?a=1&b=2&c=3&c=4&c=5#fragment", uri);
    }

    {
        uri = base.clone();
        uri.query("f=1&g=2");
        test.is("http://user:password@example.com:80/path/?f=1&g=2#fragment", uri);

        uri.query({ h: 3, i: 4, j: [ 1, 2, 3 ] });
        test.is("http://user:password@example.com:80/path/?h=3&i=4&j=1&j=2&j=3#fragment", uri);
    }

    {
        uri = base.clone();
        uri.set("http://example.net/#top");
        test.is("http://example.net/#top", uri);
    }

    {
        uri = base.clone();
        uri.set("http://example.net/?a=1&b=2&c=1&c=2&c=3#top");
        test.is("http://example.net/?a=1&b=2&c=1&c=2&c=3#top", uri);
        test.is(1, uri.query().get("a"));
        test.is(2, uri.query().get("b"));
        test.is(1, uri.query().get("c"));
    }


    {
//        uri = base.clone();
//        uri.merge({ query: "f=1&g=2" });
//        test.is("http://user:password@example.com:80/path/?a=1&b=2&c=3&c=4&c=5&f=1&g=2#fragment", uri);
    }

    {
//        uri = base.clone();
//        uri.merge("example.net?f=1&g=2");
//        test.is("http://example.net:80/path/?a=1&b=2&c=3&c=4&c=5&f=1&g=2#fragment", uri);
    }
}

function _testURIQuery(test) {

    {
        query = new b9j.uri.query.Query({ a: 1, b: 2, c: [ 3, 4, 5, 6 ] });
        test.is(1, query.get("a"));
        test.is(2, query.get("b"));
        test.is(3, query.get("c"));
        test.is("a=1&b=2&c=3&c=4&c=5&c=6", query);

        query = new b9j.uri.query.Query("a=1&b=2&c=3&c=4&c=5&c=6");
        test.is(1, query.get("a"));
        test.is(2, query.get("b"));
        test.is(3, query.get("c"));
    }
}

b9jTest(function(test) {

    _testURI(test);
    _testURIQuery(test);

});
