b9jTest(function(test) {

    {
        var parse = b9j.path._canonical;
        test.is("a/b/c", parse("a//b//c"));
        test.is("a/b/c/", parse("a//b//c//"));
        test.is("a/b/c/", parse("a/./b/././c//"));
        test.is("a/b/c/", parse("./a/./b/././c/."));

        // xx////xx     -> xx/xx

        test.is("a/b", parse("a////b"));
        test.is("/a/b", parse("////a////b"));
        test.is("/a/b/", parse("////a////b////"));
        test.is("a/", parse("a////"));

        // xx/././xx    -> xx/xx
        
        test.is("a/b", parse("a/././b"));
        test.is("/a/b", parse("/./a/././b"));
        test.is("/a/b/", parse("/././a/././b/././"));

        // ./xx         -> xx
        
        test.is("a/b", parse("./a/b"));

        // /../../xx    -> /xx
        
        test.is("/a/b", parse("/../../a/b"));
        test.is("/a/b", parse("/.././../a/b"));

        // /..          -> /
        
        test.is("/", parse("/.."));
        test.is("/", parse("/../.."));
        test.is("/", parse("/.././.."));

    }

    var path;
    {
        // .get
        path = new b9j.path.Path("a/b", "c/d", "e");
        test.is("a/b/c/d/e", path.get());

        // .set
        path.set("");
        test.is("", path.get());

        path.set("/");
        test.is("/", path.get());

        path.set("a", "b/c//");
        test.is("a/b/c/", path.get());

        path.set("a/b/c/d/e");
        test.is("a/b/c/d/e", path.get());

        // .pop
        path.pop();
        test.is("a/b/c/d", path.get());

        path.pop(2);
        test.is("a/b", path.get());

        path.pop(3);
        test.is("", path.get());

        path = new b9j.path.Path("/a/b/c");
        path.pop(10);
        test.is("/", path.get());

        path.set("/");
        path.pop();
        test.is("/", path.get());

        // .push
        path.push("a");
        test.is("/a", path.get());

        path.push("a", "b/c//");
        test.is("/a/a/b/c/", path.get());

        path.push(path + "");
        test.is("/a/a/b/c/a/a/b/c/", path.get());

        test.is("/a/a/b/c/a/a/b/c/", path.get());

        // .up .down
        path.set("a");
        path.up();
        test.is("", path + "");

        path.down("a/b/c").up();
        test.is("a/b", path + "");

        path.down("/h/i/j//").up().up().up();
        test.is("a/b", path + "");

        path.down("/h/i/j//").up(3);
        test.is("a/b", path + "");

        path.set("/");
        path.up();
        test.is("/", path + "");
    }

    {
        // .append
        path = new b9j.path.Path();

        path.append("c/d");
        test.is("c/d", path + "");
        test.is("d", path.last());

        path.append("ef");
        test.is("c/def", path + "");
        test.is("def", path.last());

        path.append("", "g/");
        test.is("c/def/g/", path + "");
        test.is("g", path.last());
    }

    {
        // .extension
        path = new b9j.path.Path("a.tar.gz.html");

        test.is(".html", path.extension());
        test.is(".gz.html", path.extension({ match: 2 }));
        test.is(".tar.gz.html", path.extension({ match: 3 }));
        test.is(".tar.gz.html", path.extension({ match: 4 }));
        test.is("a", path.clone().extension("", { match: 4 }));

        test.is("a.tar.gz.txt", path.clone().extension(".txt") + "");
        test.is("a.tar.txt", path.clone().extension(".txt", 2) + "");
        test.is("a.txt", path.clone().extension(".txt", 3) + "");
        test.is("a.tar", path.clone().extension(".txt", 3).extension(".tar") + "");
        test.is("a", path.clone().extension(".txt", 3).extension("") + "");

        path.set("");
        test.is("", path.extension());
        test.is(".html", path.clone().extension("html") + "");
        test.is(".html", path.clone().extension(".html") + "");
        test.is("", path.clone().extension("") + "");

        path.set("/");
        test.is("", path.extension());
        test.is("/.html.gz", path.clone().extension("html.gz") + "");
        test.is("/.html.gz", path.clone().extension(".html.gz") + "");
        test.is("/", path.clone().extension("") + "");
    }

    {
        path.set("c/");
        path.pop();
        test.is("", path.get());

        path.set("/c/");
        path.pop();
        test.is("/", path.get());
        path.pop();
        test.is("/", path.get());
    }

    {
        path = new b9j.path.Path();
        test.is("", path + "");
        test.is("", path.get());
        test.is("", path.at(0));
        test.is("", path.at(-1));
        test.is("", path.at(1));
        test.is("", path.first());
        test.is("", path.last());
        test.is("", path.beginning());
        test.is("", path.ending());
        test.isTrue(path.isEmpty());
        test.isFalse(path.isRoot());
        test.isFalse(path.isTree());
        test.isTrue(path.isBranch());
        test.areEqual(new Array().toString(), path.list().toString());

        path = new b9j.path.Path("/");
        test.is("/", path + "");
        test.is("/", path.get());
        test.is("", path.at(0));
        test.is("", path.at(-1));
        test.is("", path.at(1));
        test.is("", path.first());
        test.is("", path.last());
        test.is("/", path.beginning());
        test.is("/", path.ending());
        test.areEqual([].toString(), path.list().toString());
        test.isFalse(path.isEmpty());
        test.isTrue(path.isRoot());
        test.isTrue(path.isTree());
        test.isFalse(path.isBranch());

        path = new b9j.path.Path("a");
        test.is("a", path + "");
        test.is("a", path.get());
        test.is("a", path.at(0));
        test.is("a", path.at(-1));
        test.is("", path.at(1));
        test.is("a", path.first());
        test.is("a", path.last());
        test.is("a", path.beginning());
        test.is("a", path.ending());
        test.areEqual([ "a" ].toString(), path.list().toString());
        test.isFalse(path.isEmpty());
        test.isFalse(path.isRoot());
        test.isFalse(path.isTree());
        test.isTrue(path.isBranch());

        path = new b9j.path.Path("/a");
        test.is("/a", path + "");
        test.is("/a", path.get());
        test.is("a", path.at(0));
        test.is("a", path.at(-1));
        test.is("", path.at(1));
        test.is("a", path.first());
        test.is("a", path.last());
        test.is("/a", path.beginning());
        test.is("a", path.ending());
        test.areEqual([ "a" ].toString(), path.list().toString());
        test.isFalse(path.isEmpty());
        test.isFalse(path.isRoot());
        test.isTrue(path.isTree());
        test.isFalse(path.isBranch());

        path = new b9j.path.Path("/a/b");
        test.is("/a/b", path + "");
        test.is("/a/b", path.get());
        test.is("a", path.at(0));
        test.is("b", path.at(-1));
        test.is("b", path.at(1));
        test.is("a", path.first());
        test.is("b", path.last());
        test.is("/a", path.beginning());
        test.is("b", path.ending());
        test.areEqual([ "a", "b" ].toString(), path.list().toString());
        test.isFalse(path.isEmpty());
        test.isFalse(path.isRoot());
        test.isTrue(path.isTree());
        test.isFalse(path.isBranch());

        path = new b9j.path.Path("/a/b/");
        test.is("/a/b/", path + "");
        test.is("/a/b/", path.get());
        test.is("a", path.at(0));
        test.is("b", path.at(-1));
        test.is("b", path.at(1));
        test.is("a", path.first());
        test.is("b", path.last());
        test.is("/a", path.beginning());
        test.is("b/", path.ending());
        test.areEqual([ "a", "b" ].toString(), path.list().toString());
        test.isFalse(path.isEmpty());
        test.isFalse(path.isRoot());
        test.isTrue(path.isTree());
        test.isFalse(path.isBranch());

        path = new b9j.path.Path("/a/b/c");
        test.is("/a/b/c", path + "");
        test.is("/a/b/c", path.get());
        test.is("a", path.at(0));
        test.is("c", path.at(-1));
        test.is("b", path.at(1));
        test.is("a", path.first());
        test.is("c", path.last());
        test.is("/a", path.beginning());
        test.is("c", path.ending());
        test.areEqual([ "a", "b", "c" ].toString(), path.list().toString());
        test.isFalse(path.isEmpty());
        test.isFalse(path.isRoot());
        test.isTrue(path.isTree());
        test.isFalse(path.isBranch());

        path = new b9j.path.Path("a/b/c");
        test.is("a/b/c", path + "");
        test.is("a/b/c", path.get());
        test.is("a", path.at(0));
        test.is("c", path.at(-1));
        test.is("b", path.at(1));
        test.is("a", path.first());
        test.is("c", path.last());
        test.is("a", path.beginning());
        test.is("c", path.ending());
        test.areEqual([ "a", "b", "c" ].toString(), path.list().toString());
        test.isFalse(path.isEmpty());
        test.isFalse(path.isRoot());
        test.isFalse(path.isTree());
        test.isTrue(path.isBranch());
    }

});
