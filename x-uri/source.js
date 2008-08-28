/* 
 * =head1 NAME
 * 
 * b9j.uri - URI
 *
 * =head1 SYNOPSIS 
 *  
 * =head1 DESCRIPTION
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.uri');

    /*
        parseUri 1.2.1
        (c) 2007 Steven Levithan <stevenlevithan.com>
        MIT License
    */
    function _parseUri(input, strict) {
        
        var parser = strict ? _parseUri.strictParser : _parseUri.looseParser;
        var queryParser = _parseUri.queryParser;
        var partName = _parseUri.partName;

        var uri = {};
        var ii = 14;

        var match = parser.exec(input);

        while (ii--) uri[partName[ii]] = match[ii] || "";

        uri.queryHash = {};
        uri.query.replace(queryParser, function ($0, $1, $2) {
            if ($1) uri.queryHash[$1] = $2;
        });

        return uri;
    };
    _parseUri.partName = ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];
    _parseUri.queryParser = /(?:^|&)([^&=]*)=?([^&]*)/g;
    _parseUri.strictParser = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
    _parseUri.looseParser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;


    pckg.parse = function() {
        return _parseUri.apply(null, arguments);
    };

}());
