(function(){

    var pckg = b9j.namespace.declare('b9j.path');

    function canonical_string() {
        return b9j.path._canonical.apply(b9j.path, arguments);
    }

    function canonical_array() {
        return canonical_string.apply(this, arguments).split('/');
    }

    function _flatten(array, value) {
        if ("string" == typeof value) {
            array.push(value);
        }
        else if ("object" == typeof value) {
            if ("function" == typeof value.get) { // We probably have a Path object
                array.push(value.get());
            }
            else { // Assume an array
                for (var ii = 0; ii < value.length; ii++) {
                    _flatten(array, value[ii]);
                }
            }
        }
    }

    /*
	$path =~ s|/{2,}|/|g;                           # xx////xx  -> xx/xx
	$path =~ s{(?:/\.)+(?:/|\z)}{/}g;               # xx/././xx -> xx/xx
	$path =~ s|^(?:\./)+||s unless $path eq "./";	# ./xx      -> xx
	$path =~ s|^/(?:\.\./)+|/|;			            # /../../xx -> /xx
	$path =~ s|^/\.\.$|/|;				            # /..       -> /
	$path =~ s|/\z|| unless $path eq "/";		    # xx/       -> xx
    */

    pckg._canonical = function() {
        var path = [];
        _flatten(path, arguments);
        path = path.join('/').split(/\/+/).join('/');       // xx////xx     -> xx/xx
        path = path.replace(/(?:\/\.)+(?:\/|$)/g, '/');     // xx/././xx    -> xx/xx
        if ("./" != path)
            path = path.replace(/^(?:\.\/)+/, '');          // ./xx         -> xx
        path = path.replace(/^\/(?:\.\.\/)+/, '/');         // /../../xx    -> /xx
        path = path.replace(/^\/\.\.$/, '/');               // /..          -> /
        return path;
    };

    pckg.Path = function() {
        this.set.apply(this, arguments);
    };

    pckg.Path.prototype = {

        clone: function() {
            return new b9j.path.Path(this.get());
        },

        set: function() {
            this._path = canonical_array(arguments);
            if (this._path.length > 1 && this._path[0] == "") {
                this._root = true;
                if (2 == this._path.length && this._path[1] == "") { /* Dealing with [ "", "" ] case */
                    this._path = [ "" ];
                }
            }
        },

        get: function() {
            return this.toString();
        },

        toString: function() {
            if (this._path.length == 1 && "" == this._path[0]) // Might be at "/"
                return this._root ? '/' : '';
            return this._path.join('/');
        },

        pop: function() {
            var popped = [];
            var count = arguments.length ? arguments[0] : 1;
        
            while (count-- && this._path.length) {
                if (this._path.length == 1 && "" == this._path[0]) // Preserve "/"
                    break;
                popped.push(this._path.pop());
            }

            return new b9j.path.Path(popped);
        },

        up: function() {
            this.pop.apply(this, arguments);
            return this;
        },

        parent: function() {
            var path = this.clone();
            path.pop.apply(this, arguments);
            return path;
        },

        push: function() {
            this._path = canonical_array(this._path, arguments);
            return this;
        },

        down: function() {
            this.down.apply(this, arguments);
            return this;
        },

        child: function() {
            var path = this.clone();
            path.push.apply(this, arguments);
            return path;
        },

        isEmpty: function() {
            return 1 == this._path.length && "" == this._path[0] && ! this._root ? true : false;
        },

        isRoot: function() {
            return 1 == this._path.length && "" == this._path[0] && this._root ? true : false;
        },

        isTree: function() {
            return this._root ? true : false;
        },

        isBranch: function() {
            return ! this.isTree();
        },

        toTree: function() {
            this._root = true;
            if ("" == this._path[0]) return;
            this._path.splice(0, 0, "");
        },

        toBranch: function() {
            this._root = false;
            if ("" != this._path[0]) return;
            this._path.splice(0, 1);
        },

        first: function() {
            return this.at(0);
        },

        last: function() {
            return this.at(-1);
        },

        at: function(ii) {
            if (this.isEmpty()) return "";
            if (1 == this._path.length && "" == this._path[0])
                return "";
            if (0 > ii)
                ii += this._path.length;
            else if ("" == this._path[0])
                ii += 1;
            if (ii >= this._path.length)
                return "";
            if (ii == this._path.length - 1 && "" == this._path[ii])
                ii -= 1;
            return this._path[ii];
        },

        beginning: function() {
            if (this.isEmpty()) return "";
            if (this.isRoot()) return "/";
            var first = this.at(0);
            if (this.isBranch()) return first;
            return "/" + first;
            
        },

        ending: function() {
            if (this.isEmpty()) return "";
            if (this.isRoot()) return "/";
            var last = this.at(-1);
            if (last == this._path[this._path.length - 1]) return last;
            return last + "/";
            
        },

        list: function() {
            if (this.isEmpty()) return [];
            if (this.isRoot()) return [];
            var path = [].concat(this._path);
            if ("" == path[0]) path.splice(0, 1);
            if ("" == path[path.length - 1]) path.splice(path.length - 1, 1);
            return path;
        }
    };


/*
sub _canonize(@) {
	no warnings 'uninitialized';
    @_ = map {
        $_ = ref && (ref eq "Path::Abstract::Underload" || blessed $_ && $_->isa("Path::Abstract::Underload")) ? $$_ : $_;
        length() ? $_ : ();
    } map {
        ref eq "ARRAY" ? @$_ : $_
    } @_;
	my $leading = $_[0] && substr($_[0], 0, 1) eq '/';
	my $path = join '/', @_;
    my $trailing = $path && substr($path, -1) eq '/';

	# From File::Spec::Unix::canonpath
	$path =~ s|/{2,}|/|g;				# xx////xx  -> xx/xx
	$path =~ s{(?:/\.)+(?:/|\z)}{/}g;		# xx/././xx -> xx/xx
	$path =~ s|^(?:\./)+||s unless $path eq "./";	# ./xx      -> xx
	$path =~ s|^/(?:\.\./)+|/|;			# /../../xx -> xx
	$path =~ s|^/\.\.$|/|;				# /..       -> /
	$path =~ s|/\z|| unless $path eq "/";		# xx/       -> xx
	$path .= '/' if $path ne "/" && $trailing;

	$path =~ s/^\/+// unless $leading;
	return $path;
}
*/
    
}());
