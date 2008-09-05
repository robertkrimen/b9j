    b9j.test.b9jTest(function(test) {
        (function(){
            b9j.namespace.declare('xyzzy');
            b9j.namespace.declare('xyzzy.io');
        })();
        test.isObject(xyzzy);
        test.isObject(xyzzy.io);
 
        b9j.namespace.declare({ com: {
            example:
                [ 'apple', 'banana', 'cherry.grape' ] }
        });

        test.isObject(com);
        test.isObject(com.example);
        test.isObject(com.example.apple);
        test.isObject(com.example.banana);
        test.isObject(com.example.cherry);
        test.isObject(com.example.cherry.grape);

        com.example.apple.xyzzy = function(){
            return 1;
        };

        com.example.cherry.grape.frobozz = function(){
            return 2;
        };

        b9j.namespace.using(com.example.apple, com.example.cherry.grape).run(function(apple, grape){
            test.is(apple.xyzzy(), 1);
            test.is(grape.frobozz(), 2);
        });
    });

