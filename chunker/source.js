/* 
 * =head1 NAME
 * 
 * b9j.chunker -
 *
 * =head1 SYNOPSIS 
 *
 * =head1 DESCRIPTION
 *
 */

(function(){

    var pckg = b9j.namespace.declare('b9j.chunker');
    pckg.encodeBeforeChunking = true;

    function sendChunk(uri, query, payload, handler) {
        var _uri = uri.clone();
        _uri.query().set(query);
        if ( b9j.chunker.encodeBeforeChunking ) {
            jQuery.getJSON(_uri + "&cp=" + payload + "&cb=?", handler);
        }
        else {
            _uri.query().set("cp", payload);
            jQuery.getJSON(_uri + "&cb=?", handler);
        }

    }

    function sendMessage(uri, message, handler) {

        uri = new b9j.uri.URI(uri);

        if (! jQuery)
            throw "jQuery is required for b9j.chunker";
        if ( "object" == typeof message )
            message = YAHOO.lang.JSON.stringify(message);
        if ( b9j.chunker.encodeBeforeChunking )
            message = encodeURIComponent(message)

        var payload;
        var payload_size = 10;
        if (message.length > payload_size) {
            payload = [];
            var from = 0;
            while (from < message.length) {
                var length = from + payload_size > message.length ? message.length - from : payload_size;
                if ( b9j.chunker.encodeBeforeChunking )
                    if (message[from + length - 1] == '%')
                        length -= 1;
                    else if (message[from + length - 2] == '%')
                        length -= 2;
                payload.push(message.substr(from, length));
                from += length;
            }
        }
        else 
            payload = [ message ];

        sendChunk(uri, { ml: payload.length }, payload[0], function(data){
            var rank = 0;
            if (data.complete && handler) {
                handler(data)
            }
            else {
                while(true) {
                    rank += 1;
                    payload.splice(0, 1);

                    if (! payload.length)
                        break;

                    sendChunk(uri, { mk: data.mk, cr: rank }, payload[0], function(data){
                        if (data.complete && handler) {
                            handler(data)
                        }
                    });
                }
            }
        });
    }

    pckg.send = sendMessage;


}());

/*
 * =head1 SEE ALSO
 *
 * [b9j](http://appengine.bravo9.com/b9j) - A JavaScript toolkit
 *
 * =head1 AUTHOR
 *
 * Robert Krimen `<robertkrimen at gmail.com>` [http://bravo9.com](http://bravo9.com)
 *
 * =head1 DOWNLOAD
 *
 * Available as part of [**b9j**](http://appengine.bravo9.com/b9j): [b9j-latest.zip](http://appengine.bravo9.com/b9j/b9j-latest.zip)
 *
 * =head1 SOURCE
 *
 * You can contribute or fork this project via GitHub:
 *
 * [http://github.com/robertkrimen/b9j/tree/master](http://github.com/robertkrimen/b9j/tree/master)
 *
 *      git clone git://github.com/robertkrimen/b9j.git
 *
 * =head1 COPYRIGHT & LICENSE
 *
 * Copyright 2008 Robert Krimen
 *
 * Code licensed under the BSD License: [http://appengine.bravo9.com/b9j/documentation/license.txt](http://appengine.bravo9.com/b9j/documentation/license.txt)
 *
 */
