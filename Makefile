.PHONY: all clean build test _build ship build_documentation build_test bootstrap example
.PHONY: source/test.html

b9j_version := 0.2.0

yui_version := 2.8.1
yuicompressor_version := 2.4.2

#http://yuilibrary.com/downloads/yuicompressor/yuicompressor-2.4.2.zip

build := build
build_tmp := build/tmp
build_documentation := build/documentation
build_test := build/test

doc_simple := doc-simply

ship := $(build)/b9j-$(b9j_version)
ship_zip := $(build)/b9j-$(b9j_version).zip

package := yui b9j namespace test browsersmoke b9jTest path uri digest random pguid chunker environment datetime.interval
package_source := $(package:%=source/%/source.js)
package_documentation := $(filter-out yui, $(package))
package_documentation := $(package_documentation:%=$(build_documentation)/%.html)
package_test := $(package:%=$(build_test)/%.html)

wget_yui_js = wget 'http://yui.yahooapis.com/$(yui_version)/build/$1/$1.js'
wget_yui_css = wget 'http://yui.yahooapis.com/$(yui_version)/build/$1'

check_js_s_window := js -s -e 'var window = {}; var navigator = { userAgent: "" };' -f
check_js_s_window_YAHOO := js -s -e 'var YAHOO = { lang: {}, util: {}, tool: {} }; var window = {}; var navigator = { userAgent: "" };' -f
check_js_sC := js -s -C

yuicompressor_jar := $(build_tmp)/yuicompressor-$(yuicompressor_version)/$(build)/yuicompressor-$(yuicompressor_version).jar
yuicompressor_zip := $(build_tmp)/yuicompressor-$(yuicompressor_version).zip
yuicompress_js = java -jar $(yuicompressor_jar) $1 -o $2.tmp.js && js -C $2.tmp.js && mv $2.tmp.js $2
yuicompress = java -jar $(yuicompressor_jar) $1 -o $2

b9j_source := $(filter-out test browsersmoke b9jTest, $(package))
b9j_source := $(b9j_source:%=source/%/source.js)

bootstrap_js := $(build)/bootstrap.js
bootstrap_css := $(build)/bootstrap.css
b9j_bootstrap_js := $(build)/b9j.bootstrap.js
b9j_bootstrap_css := $(build)/b9j.bootstrap.css

yui_js_package := yahoo json dom event logger yuitest container
yui_js_package_js := $(yui_js_package:%=$(build_tmp)/%.js)
yui_css_package := reset-fonts-grids base logger yuitest
yui_css_package_css := $(yui_css_package:%=$(build_tmp)/%.css)

jquery_js := $(build_tmp)/jquery.js
yui_js := $(build_tmp)/yui.js
yui_css := $(build_tmp)/yui.css

all: build

test: source/test.html
	firefox $<

source/test.html:
	echo '<html><head><link rel="stylesheet" type="text/css" href="../build/b9j.bootstrap.css"></head><body style="font-size: 88%; text-align: left;">' > $@
	for package in $(sort $(package)); do echo "<h2><a href='./$$package/test.html'>$$package</a></h2><iframe width="100%" src='./$$package/test.html'></iframe><br/>"; done >> $@
	echo '</body></html>' >> $@

_build: $(yuicompressor_jar) bootstrap
	mkdir -p $(build)
	for source in $(package_source); do $(check_js_sC) $$source; done

bootstrap: $(bootstrap_js) $(bootstrap_css) $(b9j_bootstrap_js) $(b9j_bootstrap_css)

$(b9j_bootstrap_js): $(bootstrap_js) source/b9j/source.js source/namespace/source.js source/test/source.js source/b9jTest/source.js
	cat $^ > $@
	$(call yuicompress_js,$@,$@)

$(b9j_bootstrap_css): $(bootstrap_css) source/b9jTest/source.css
	cat $^ > $@
	$(call yuicompress,$@,$@)

$(bootstrap_js): $(jquery_js) assets/jquery.livequery.js $(yui_js)
	cat $^ > $@
	$(call yuicompress_js,$@,$@)

$(bootstrap_css): $(yui_css)
	cat $^ > $@
	$(call yuicompress,$@,$@)

$(yui_js): $(yui_js_package_js)
	cat $^ > $@
	$(call yuicompress_js,$@,$@)

$(yui_js_package_js):
	$(call wget_yui_js,$(@:$(build_tmp)/%.js=%)) -O $@

$(yui_css): $(yui_css_package_css)
	cat $^ > $@
	$(call yuicompress,$@,$@)

$(build_tmp)/reset-fonts-grids.css:
	$(call wget_yui_css,reset-fonts-grids/reset-fonts-grids.css) -O $@

$(build_tmp)/base.css:
	$(call wget_yui_css,base/base.css) -O $@

$(build_tmp)/logger.css:
	$(call wget_yui_css,logger/assets/skins/sam/logger.css) -O $@

$(build_tmp)/yuitest.css:
	$(call wget_yui_css,logger/assets/skins/sam/logger.css) -O $@

$(jquery_js):
	wget 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js' -O $@

##########
# build ##
##########

build:	_build \
	$(build)/b9j.js \
	$(build)/browsersmoke.js \
	$(build)/b9jTest.js \
	$(build)/b9jTest.css \
	$(build)/b9j.uri.js \
	build_documentation build_test

$(build)/b9j.uncompressed.js: $(b9j_source)
	cat $^ > $@

$(build)/b9j.uri.uncompressed.js: \
	source/yui/source.js \
	source/b9j/source.js \
	source/namespace/source.js \
	source/path/source.js \
	source/uri/source.js
	cat $^ > $@

$(build)/b9j.js: $(build)/b9j.uncompressed.js
	$(call yuicompress_js,$<,$@)

$(build)/b9j.uri.js: $(build)/b9j.uri.uncompressed.js
	$(call yuicompress_js,$<,$@)

$(build)/b9jTest.js: $(bootstrap_js) $(build)/b9j.uncompressed.js source/b9jTest/source.js
	cat $^ > $@
	$(call yuicompress_js,$@,$@)

$(build)/browsersmoke.js: $(bootstrap_js) $(build)/b9j.uncompressed.js
	cat $^ > $@
	$(call yuicompress_js,$@,$@)

# TODO Change this to b9j.uncompressed.css at some point
$(build)/b9jTest.css: $(bootstrap_css) source/b9jTest/source.css
	cat $^ > $@
	$(call yuicompress,$@,$@)

#################
# documentation #
#################

build_documentation: $(package_documentation) $(build_documentation)/b9jTest-example.html $(build_documentation)/license.txt

$(package_documentation): $(build_documentation)/%.html: source/%/source.js
	mkdir -p $(build_documentation)
	cat $< | doc-simply > $@

$(build_documentation)/b9jTest-example.html: source/b9jTest/example.html
	cp $< $@

$(build_documentation)/license.txt: license.txt
	cp $< $@

########
# test #
########

build_test: $(package_test)

$(package_test): $(build_test)/%.html: source/%/test.js test.html
	mkdir -p $(build_test)
	cp $< $@.js
	cp test.html $@
	perl -pi -e 'my $$file = "$@.js"; $$file =~ s/(?:.*\/)?([^\/]+)$$/$$1/; s{\$$TEST}{./$$file}' $@

########
# ship #
########

ship: wipe build
	find $(build)/documentation $(build)/test -name static -prune -or -type f -name "*.html"  -print -exec tidy -mi --vertical-space no --tidy-mark no -asxml --wrap 0 {} \;
	rm -rf $(ship) $(ship_zip)
	mkdir -p $(ship) $(ship)/documentation $(ship)/test
	(cd $(build) && cp browsersmoke.js b9jTest.css b9jTest.js b9j.js b9j.uncompressed.js b9j.uri*.js ../$(ship))
	(cd $(build)/documentation && cp * ../../$(ship)/documentation)
	(cd $(build)/test && cp * ../../$(ship)/test)
	rsync -Cav example/ $(ship)/example/
	(cd $(build) && zip -r ../$(ship_zip) `basename $(ship)`)
	rm -f $(build)/b9j-latest*
	ln -sf `basename $(ship)` $(build)/b9j-latest
	ln -sf `basename $(ship_zip)` $(build)/b9j-latest.zip
	rm -rf built
	rsync -Cav $(build)/b9j-latest/ built/

clean:
	rm -rf build

wipe: 
	rm -f $(build)/*.js $(build)/*.css
	rm -rf $(build)/documentation $(build)/test

$(yuicompressor_zip):
	mkdir -p $(build_tmp)
	wget 'http://www.julienlecomte.net/yuicompressor/yuicompressor-$(yuicompressor_version).zip' -O $(yuicompressor_zip)
	touch $@

$(yuicompressor_jar): $(yuicompressor_zip)
	(cd $(build_tmp) && unzip `basename $(yuicompressor_zip)`)
	touch $@

example:
	cp source/uri/example.* example/uri

# build := build
# build_tmp := build/tmp
# build_documentation := build/documentation
# build_test := build/test

# b9j_version := 0.1.6
# ship := $(build)/b9j-$(b9j_version)
# ship_zip := $(build)/b9j-$(b9j_version).zip

# yui_version := 2.5.2
# yuicompressor_version := 2.3.6
# yuicompressor_jar := $(build_tmp)/yuicompressor-$(yuicompressor_version)/$(build)/yuicompressor-$(yuicompressor_version).jar
# yuicompressor_zip := $(build_tmp)/yuicompressor-$(yuicompressor_version).zip
# yuicompress := java -jar $(yuicompressor_jar)

# #package := b9j-YUI b9j namespace test b9jTest path uri digest random pguid
# #package := b9j-YUI b9j namespace test
# #package := test
# package := b9j-YUI b9j namespace test test.smoke b9jTest path uri digest random pguid chunker
# package_source := $(package:%=source/%/source.js)
# b9j_source := $(filter-out b9jTest, $(package))
# b9j_source := $(b9j_source:%=source/%/source.js)
# package_documentation := $(filter-out b9j-YUI, $(package))
# package_documentation := $(package_documentation:%=$(build_documentation)/%.html)
# package_test := $(package:%=$(build_test)/%.html)

# all: build

# clean:
#     rm -rf build

# $(yuicompressor_zip):
#     mkdir -p $(build_tmp)
#     wget 'http://www.julienlecomte.net/yuicompressor/yuicompressor-$(yuicompressor_version).zip' -O $(yuicompressor_zip)
#     touch $@

# $(yuicompressor_jar): $(yuicompressor_zip)
#     (cd $(build_tmp) && unzip `basename $(yuicompressor_zip)`)
#     touch $@

# $(build)/b9j.bootstrap.uncompressed.js: source/b9j/source.js source/namespace/source.js source/test/source.js
#     cat $^ > $@

# $(build)/b9j.bootstrap.js: $(build)/b9j.bootstrap.uncompressed.js $(yuicompressor_jar)
#     $(yuicompress) $< -o $@.tmp.js
#     $(check_js_syntax) $@.tmp.js
#     mv $@.tmp.js $@

# $(package_documentation): $(build_documentation)/%.html: source/%/source.js
#     mkdir -p $(build_documentation)
#     cat $< | ./local/script/doc-simply > $@

# $(package_test): $(build_test)/%.html: source/%/test.js test.html
#     mkdir -p $(build_test)
#     cp $< $@.js
#     cp test.html $@
#     perl -pi -e 'my $$file = "$@.js"; $$file =~ s/(?:.*\/)?([^\/]+)$$/$$1/; s{\$$TEST}{./$$file}' $@

# $(build)/b9j.uncompressed.js: $(b9j_source)
#     cat $^ > $@

# $(build)/b9j.js: $(build)/b9j.uncompressed.js $(yuicompressor_jar)
#     $(yuicompress) $< -o $@.tmp.js
#     $(check_js) $@.tmp.js
#     mv $@.tmp.js $@

# build: _build $(build)/b9j.bootstrap.js $(build)/b9j.js documentation b9jTest $(package_test)

# documentation: $(package_documentation) $(build_documentation)/b9jTest-example.html $(build_documentation)/license.txt

# $(build_documentation)/b9jTest-example.html: source/b9jTest/example.html
#     cp $< $@

# $(build_documentation)/license.txt: license.txt
#     cp $< $@

# wipe: 
#     rm -f $(build)/*.js $(build)/*.css
#     rm -rf $(build)/documentation $(build)/test

# _build:
#     mkdir -p $(build)
#     for source in $(package_source); do $(check_js_syntax) $$source; done

# ship: wipe build
#     find $(build)/documentation $(build)/test -name static -prune -or -type f -name "*.html"  -print -exec tidy -mi --vertical-space no --tidy-mark no -asxml --wrap 0 {} \;
#     rm -rf $(ship) $(ship_zip)
#     mkdir -p $(ship) $(ship)/documentation $(ship)/test
#     (cd $(build) && cp b9jTest.css b9jTest.js b9j.js b9j.uncompressed.js ../$(ship))
#     (cd $(build)/documentation && cp * ../../$(ship)/documentation)
#     (cd $(build)/test && cp * ../../$(ship)/test)
#     (cd $(build) && zip -r ../$(ship_zip) `basename $(ship)`)
#     rm -f $(build)/b9j-latest*
#     ln -sf `basename $(ship)` $(build)/b9j-latest
#     ln -sf `basename $(ship_zip)` $(build)/b9j-latest.zip

