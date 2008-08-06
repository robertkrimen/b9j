;(function(){
    
    var pckg = YAHOO.namespace("bravo9.face");

    pckg.Identifier = function(identifier) {
        this.identifier = identifier;
    };

    pckg.Identifier.prototype = {

        ch: function(child) {
            return new pckg.Identifier(this.vl(child));
        },

        lb: function(child) {
            return "#" + this.vl(child);
        },

        vl: function(child) {
            if (child) {
                return this.identifier + "-" + child;
            }
            return this.identifier;
        }
    };

    pckg.Face = function(widget){
        this.widget = widget;
        this.idnt = widget.idnt;
        this.facet = {};
    };

    pckg.Face.prototype = {

        add: function(name, idchild, augment) {
            this.facet[name] = new pckg.Facet(this, name, this.idnt.ch(idchild), augment);
        },

        hideAll: function(immediate, except) {
            for (var property in this.facet) {
                var facet = this.facet[property];
                if (facet != except) {
                    facet.hide(immediate);
                }
            }
        }
    };

    pckg.Facet = function(face, name, idnt, augment){
        this.face = face;
        this.name = name;
        this.idnt = idnt;
        this.visible = false;
    };

    pckg.Facet.prototype = {

        _show: function(immediate) {
            this.visible = true;
            if (immediate) $(this.idnt.lb()).css("display", "block");
        },

        show: function(immediate) {
            this.face.hideAll(immediate, this);
            this._show(immediate);
        },

        hide: function(immediate) {
            this.visible = false;
            if (immediate) $(this.idnt.lb()).css("display", "none");
        },

        cssDisplayValue: function() {
            return this.visible ? "block" : "none";
        }
    };

}());
