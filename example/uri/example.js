var uriSourceHistory = [];
var uri = new b9j.uri.URI();

function example_addHistory(uri, source) {
    if (null == uri)
        uri = "";
    else
        uri = "<a class=\"uri-from-history\" href=\"#\">" + uri + "</a>";

    var html =  "<div class=\"yui-g\ uri-source-history-line\"><div class=\"yui-u first uri-history\">" +
                uri + 
                "</div><div class=\"yui-u source-history\"><pre>" + 
                source +
                "</pre></div></div>";

    $("#uri-source-history").prepend(html);
}

function example_update() {
    $("#uri").html(uri.toString());
}

function uri_function(fn, arguments_, fn_name) {
    if (! fn_name)
        fn_name = fn;
    uri[fn].apply(uri, arguments_);
    if (1 == arguments_.length && "" == arguments_[0])
        arguments_[0] = '""'
    var arguments_string = b9j.isValue(arguments_[0]) || arguments_.length > 1 ? " " + Array.prototype.slice.call(arguments_).join(",") + " " : "";
    example_addHistory(uri, "uri." + fn_name + "(" + arguments_string + ");");
    example_update();
}

function uri_query_function(fn, arguments_, fn_name) {
    if (! fn_name)
        fn_name = fn;
    var query = uri.query();
    query[fn].apply(query, arguments_);
    if (1 == arguments_.length && "" == arguments_[0])
        arguments_[0] = '""'
    var arguments_string = b9j.isValue(arguments_[0]) || arguments_.length > 1 ? " " + Array.prototype.slice.call(arguments_).join(",") + " " : "";
    example_addHistory(uri, "uri.query()." + fn_name + "(" + arguments_string + ");");
    console.log(query, query.toString());
    example_update();
}

$(document).ready(function(){

    $("a.uri-from-history").livequery("click", function() {
        arguments_ = [ this.innerHTML ];
        uri_function("set", arguments_);
    });

    function _default(value, default_) {
        if (1 == arguments.length)
            default_ = "";
        return null == value || "" == value ? value : default_;
    }

    {
        $("#uri-button-parent").bind("click", function(){
            arguments_ = [ ];
            uri_function("up", arguments_, "parent"); 
        });

        $("#uri-button-child").bind("click", function(){
            arguments_ = [ $("#uri-input-child").val() ];
            uri_function("down", arguments_, "child"); 
        });
    }

    {
        $("#uri-button-path").bind("click", function(){
            arguments_ = [ $("#uri-input-path").val() ];
            uri_function("path", arguments_);
        });

        $("#uri-button-path-a-b-c").bind("click", function(){
            arguments_ = [ "a/b/c" ];
            uri_function("path", arguments_);
        });

        $("#uri-button-append").bind("click", function(){
            arguments_ = [ $("#uri-input-append").val() ];
            uri_function("append", arguments_);
        });

        $("#uri-button-append-d-e-f").bind("click", function(){
            arguments_ = [ "d/e/f" ];
            uri_function("append", arguments_);
        });

    }

    {
        $("#uri-button-extension").bind("click", function(){
            arguments_ = [ _default( $("#uri-input-extension").val() ) ];
            uri_function("extension", arguments_);
        });

        $("#uri-button-extension-html").bind("click", function(){
            arguments_ = [ "html" ];
            uri_function("extension", arguments_); 
        });

        $("#uri-button-extension-txt").bind("click", function(){
            arguments_ = [ "txt" ];
            uri_function("extension", arguments_); 
        });

        $("#uri-button-extension-js").bind("click", function(){
            arguments_ = [ "js" ];
            uri_function("extension", arguments_); 
        });

        $("#uri-button-extension-css").bind("click", function(){
            arguments_ = [ "css" ];
            uri_function("extension", arguments_); 
        });

        $("#uri-button-extension-pl").bind("click", function(){
            arguments_ = [ "pl" ];
            uri_function("extension", arguments_); 
        });

        $("#uri-button-extension-php").bind("click", function(){
            arguments_ = [ "php" ];
            uri_function("extension", arguments_); 
        });
    }

    {
        $("#uri-button-scheme").bind("click", function(){
            arguments_ = [ $("#uri-input-scheme").val() ];
            uri_function("scheme", arguments_);
        });

        $("#uri-button-scheme-ftp").bind("click", function(){
            arguments_ = [ "ftp" ];
            uri_function("scheme", arguments_); 
        });

        $("#uri-button-scheme-http").bind("click", function(){
            arguments_ = [ "http" ];
            uri_function("scheme", arguments_); 
        });

        $("#uri-button-scheme-https").bind("click", function(){
            arguments_ = [ "https" ];
            uri_function("scheme", arguments_); 
        });
    }

    {
        $("#uri-button-host").bind("click", function(){
            arguments_ = [ $("#uri-input-host").val() ];
            uri_function("host", arguments_);
        });

        $("#uri-button-host-example-com").bind("click", function(){
            arguments_ = [ "example.com" ];
            uri_function("host", arguments_); 
        });

        $("#uri-button-host-www-example-org").bind("click", function(){
            arguments_ = [ "www.example.org" ];
            uri_function("host", arguments_); 
        });
    }

    {
        $("#uri-button-port").bind("click", function(){
            arguments_ = [ $("#uri-input-port").val() ];
            uri_function("port", arguments_);
        });

        $("#uri-button-port-80").bind("click", function(){
            arguments_ = [ 80 ];
            uri_function("port", arguments_); 
        });

        $("#uri-button-port-443").bind("click", function(){
            arguments_ = [ 443 ];
            uri_function("port", arguments_); 
        });

        $("#uri-button-port-8080").bind("click", function(){
            arguments_ = [ 8080 ];
            uri_function("port", arguments_); 
        });
    }

    {
        $("#uri-button-user").bind("click", function(){
            arguments_ = [ $("#uri-input-user").val() ];
            uri_function("user", arguments_);
        });

        $("#uri-button-user-alice").bind("click", function(){
            arguments_ = [ "alice" ];
            uri_function("user", arguments_); 
        });

        $("#uri-button-user-bob").bind("click", function(){
            arguments_ = [ "bob" ];
            uri_function("user", arguments_); 
        });
    }

    {
        $("#uri-button-password").bind("click", function(){
            arguments_ = [ $("#uri-input-password").val() ];
            uri_function("password", arguments_);
        });

        $("#uri-button-password-xyzzy").bind("click", function(){
            arguments_ = [ "xyzzy" ];
            uri_function("password", arguments_); 
        });

        $("#uri-button-password-frobozz").bind("click", function(){
            arguments_ = [ "frobozz" ];
            uri_function("password", arguments_); 
        });
    }

    {
        $("#uri-button-fragment").bind("click", function(){
            arguments_ = [ $("#uri-input-fragment").val() ];
            uri_function("fragment", arguments_);
        });

        $("#uri-button-fragment-top").bind("click", function(){
            arguments_ = [ "top" ];
            uri_function("fragment", arguments_);
        });

        $("#uri-button-fragment-bottom").bind("click", function(){
            arguments_ = [ "bottom" ];
            uri_function("fragment", arguments_);
        });
    }

    {
        $("#uri-button-query-clear").bind("click", function(){
            arguments_ = [ ]
            uri_query_function("clear", arguments_);
        });
    }

    {
        $("#uri-button-query-set").bind("click", function(){
            arguments_ = [ $("#uri-input-query-set").val() ];
            uri_query_function("set", arguments_);
        });

        $("#uri-button-query-set-a-b-c").bind("click", function(){
            arguments_ = [ "a=1&b=2&c=3&c=4&c=5" ];
            uri_query_function("set", arguments_);
        });

        $("#uri-button-query-set-hello-world").bind("click", function(){
            arguments_ = [ "a=\"Hello, World!\"" ];
            uri_query_function("set", arguments_);
        });

        $("#uri-button-query-set-a-6").bind("click", function(){
            arguments_ = [ "a", 6 ];
            uri_query_function("set", arguments_);
        });

        $("#uri-button-query-set-b-7").bind("click", function(){
            arguments_ = [ "b", 7 ];
            uri_query_function("set", arguments_);
        });

        $("#uri-button-query-set-c-8").bind("click", function(){
            arguments_ = [ "c", 8 ];
            uri_query_function("set", arguments_);
        });
    }

    {
        $("#uri-button-query-add").bind("click", function(){
            arguments_ = [ $("#uri-input-query-add").val() ];
            uri_query_function("add", arguments_);
        });

        $("#uri-button-query-add-a-b-c").bind("click", function(){
            arguments_ = [ "a=1&b=2&c=3&c=4&c=5" ];
            uri_query_function("add", arguments_);
        });

        $("#uri-button-query-add-hello-world").bind("click", function(){
            arguments_ = [ "a=\"Hello, World!\"" ];
            uri_query_function("add", arguments_);
        });

        $("#uri-button-query-add-a-6").bind("click", function(){
            arguments_ = [ "a", 6 ];
            uri_query_function("add", arguments_);
        });

        $("#uri-button-query-add-b-7").bind("click", function(){
            arguments_ = [ "b", 7 ];
            uri_query_function("add", arguments_);
        });

        $("#uri-button-query-add-c-8").bind("click", function(){
            arguments_ = [ "c", 8 ];
            uri_query_function("add", arguments_);
        });
    }

    {
        $("#uri-button-query-append").bind("click", function(){
            arguments_ = [ $("#uri-input-query-append").val() ];
            uri_query_function("append", arguments_);
        });

        $("#uri-button-query-append-hello-world").bind("click", function(){
            arguments_ = [ "a=\"Hello, World!\"" ];
            uri_query_function("append", arguments_);
        });
    }

    example_addHistory(null, "&lt;script src=\"http://appengine.bravo9.com/b9j/b9j.uri.js\"\n        type=\"text/javascript\"&gt;&lt;/script&gt;");
    example_addHistory(null, "var uri = new b9j.uri.URI()");
    uri_function("set", [ "http://example.com/a/b/c?a=1#top" ]);

});

