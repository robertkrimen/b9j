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
