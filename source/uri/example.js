var uriSourceHistory = [];
var uri = new b9j.uri.URI();

function example_addHistory(uri, source) {
    var html =  "<div class=\"yui-g\"><div class=\"yui-u first\">" +
                uri +
                "</div><div class=\"yui-u\">" + 
                source +
                "</div></div>";
    $("#uri-source-history").append(html);
}

function example_update() {
    $("#uri").html(uri.toString());
}

function uri_function(fn, arguments_, fn_name) {
    if (! fn_name)
        fn_name = fn;
    uri[fn].apply(uri, arguments_);
    example_addHistory(uri, "uri." + fn_name + "( " + Array.prototype.slice.call(arguments_).join(",") + " )");
    example_update();
}

$(document).ready(function(){

    $("#uri-button-parent").bind("click", function(){
        arguments_ = [ ];
        uri_function("up", arguments_, "parent"); 
    });
    $("#uri-button-child").bind("click", function(){
        arguments_ = [ $("#uri-input-child").val() ];
        uri_function("down", arguments_, "child"); 
    });

    $("#uri-button-scheme-http").bind("click", function(){
        arguments_ = [ "http" ];
        uri_function("scheme", arguments_); 
    });
    $("#uri-button-scheme-https").bind("click", function(){
        arguments_ = [ "https" ];
        uri_function("scheme", arguments_); 
    });

    $("#uri-button-fragment").bind("click", function(){
        arguments_ = [ $("#uri-input-fragment").val() ];
        uri_function("fragment", arguments_);
    });

    uri_function("set", [ "http://example.com/a/b/c" ]);

});

