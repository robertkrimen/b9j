(function(){

    var pckg = b9j.namespace.declare('b9j.path');

    pckg._canonical = function() {
        var path = Array.prototype.slice.call(arguments);
        path = path.join('/').split(/\/+/).join('/');
        path = path.replace(/(?:\/\.)+(?:\/|$)/g, '/');
        return path;
    };

    pckg.canonical = function() {
        return pckg._canonical.apply(pckg, arguments);
    };

    pckg.Path = function() {
        this.path = b9j.path.canonical.apply(b9j.path.canonical, arguments).split('/');
    };

    pckg.Path.prototype = {

        get: function() {
            if (this.path.length == 1 && "" == this.path[0]) // At "/"
                return '/';
            return this.path.join('/');
        },

        pop: function() {
            var popped = [];
            var count = arguments.length ? arguments[0] : 1;
        
            while (count-- && this.path.length) {
                if (this.path.length == 1 && "" == this.path[0]) // Preserve "/"
                    break;
                popped.push(this.path.pop());
            }
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
