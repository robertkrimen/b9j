b9j.test.b9jTest(function(test) {

    {
        var a, b, result;
        a = { a: 1, b: 2 };
        b = { b: 3, c: 4 };
        c = { b: 3, c: 5, d: 6 };

        result = b9j.merge(a);
        test.is(1, result.a);
        test.is(2, result.b);
        result.a = 3;
        test.is(3, result.a);
        test.is(1, a.a);

        result = b9j.merge(a, b);
        test.is(1, result.a);
        test.is(3, result.b);
        test.is(4, result.c);

        result = b9j.merge(a, b, c);
        test.is(1, result.a);
        test.is(3, result.b);
        test.is(5, result.c);
        test.is(6, result.d);

    }

    {
        var a, b, result;
        a = { a: 1, b: 2 };
        b = { b: 3, c: 4 };
        c = { b: 3, c: 5, d: 6 };
        d = [ 1, 2, 3, [ 4, 5, 6 ] ];
        e = { a: 1, b: 2, c: { d: 4, e: [ 1, 2, 3 ] } };
        f = { a: 1, b: 2, c: [ 1, 2, 3 ] };

        result = b9j.clone(a);
        test.is(1, result.a);
        test.is(2, result.b);

        result = b9j.clone(d);
        test.is(1, result[0]);
        test.is(2, result[1]);
        test.is(4, result[3][0]);
        result[3][0] = 7;
        test.is(7, result[3][0]);
        test.is(4, d[3][0]);

        result = b9j.clone(e);
        test.is(1, result.a);
        test.is(2, result.b);
        test.is(4, result.c.d);
        result.c.d = 5;
        test.is(4, e.c.d);
        test.is(1, result.c.e[0]);
        result.c.e[0] = 6;
        test.is(6, result.c.e[0]);
        test.is(1, e.c.e[0]);

        result = b9j.clone(f);
        test.is(1, result.a);
        test.is(2, result.b);
        test.is(1, result.c[0]);
        test.is(2, result.c[1]);
        test.is(3, result.c[2]);

    }

});
