if (typeof b9j == "undefined" || !b9j) {
    var b9j = {};
}

(function(){

    // '_namespace' adapted from work by Karl Krukow
    // http://higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing

    var namespaceRE = b9j._namespaceRE = /^(?:[a-zA-Z_]\w*[.])*[a-zA-Z_]\w*$/;
    function _namespace(namespace, context) {
        var ii, limit;

        context = context || window;
        if (! context) {
            throw new Error('Not given context and "window" is undefined');
        }

        namespace = namespace.valueOf();
        if ('string' == typeof namespace) {
            if (! namespaceRE.test(namespace)) {
                throw new Error('"'+namespace+'" is not a valid namespace specification');
            }
            var parts = namespace.split('.');
            for (ii = 0, limit = parts.length; ii < limit; ii++) {
                var part = parts[ii];
                context = (context[part] = context[part] || {});
            }
        }
        else if ('object' == typeof namespace) {
            if ('number' == typeof namespace.length && 'function' == typeof namespace.splice) {
                // It's an array!
                for (ii = 0, limit = namespace.length; ii < limit; ii++) {
                    _namespace(namespace[ii], context);
                }
            }
            else {
                for (ii in namespace) {
                    if (namespace.hasOwnPropery(ii)) {
                        context[ii] = context[ii] || {};
                        _namespace(namespace[ii], context[ii]);
                    }
                }
            }
        }
        else {
            throw new TypeError;
        }

        return context;
    };

    b9j._namespace = _namespace;

})();
/*
// http://higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing
function namespace(spec,context) {
    var validIdentifier = /^(?:[a-zA-Z_]\w*[.])*[a-zA-Z_]\w*$/,
        i,N;
    context = context || window;
    spec = spec.valueOf();
    if (typeof spec === 'object') {
            if (typeof spec.length === 'number') {//assume an array-like object
                for (i=0,N=spec.length;i<N;i++) {
                    namespace(spec[i],context);
                }
            }
            else {//spec is a specification object e.g, {com: {trifork: ['model,view']}}
                for (i in spec) if (spec.hasOwnProperty(i)) {
                    context[i] = context[i] || {};
                    namespace(spec[i], context[i]);//recursively descend tree
                }
            }
    } else if (typeof spec === 'string') {
            (function handleStringCase(){
               var parts;
               if (!validIdentifier.test(spec)) {
                   throw new Error('"'+spec+'" is not a valid name for a package.');
               }
               parts = spec.split('.');
               for (i=0,N=parts.length;i<N;i++) {
                   spec = parts[i];
                   context[spec] = context[spec] || {};
                   context = context[spec];
               }
            })();
    }
    else {
       throw new TypeError();
    }
}
*/
(function(){

    // 'use' adapted from work by Karl Krukow
    // http://higher-order.blogspot.com/2008/02/designing-clientserver-web-applications.html#Namespacing

    var pckg = b9j._namespace('b9j.namespace');

    pckg.use = function() {
        return {
            run: function(inner) {
                return inner.apply(arguments[0],arguments);
            }
         };
    };
    pckg.using = pckg.use;

    pckg.namespaceRE = b9j._namespaceRE;
    pckg.namespace = b9j._namespace;
    pckg.declare = b9j._namespace;

}());
