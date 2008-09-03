.PHONY: all clean build _build ship documentation

CHECK_js := js -s -e 'var window = {}; var navigator = { userAgent: "" };' -f
CHECK_js_with_YAHOO := js -s -e 'var YAHOO = { lang: {}, util: {}, tool: {} }; var window = {}; var navigator = { userAgent: "" };' -f
CHECK_js_syntax := js -s -C

BUILD := build
BUILD_tmp := build/tmp
BUILD_documentation := build/documentation
BUILD_test := build/test

b9j_VERSION := 0.1.6
SHIP := $(BUILD)/b9j-$(b9j_VERSION)
SHIP_ZIP := $(BUILD)/b9j-$(b9j_VERSION).zip

yui_VERSION := 2.5.2
yuicompressor_VERSION := 2.3.6
yuicompressor_JAR := $(BUILD_tmp)/yuicompressor-$(yuicompressor_VERSION)/$(BUILD)/yuicompressor-$(yuicompressor_VERSION).jar
yuicompressor_ZIP := $(BUILD_tmp)/yuicompressor-$(yuicompressor_VERSION).zip
yuicompress := java -jar $(yuicompressor_JAR)

#PACKAGE := b9j-YUI b9j namespace test b9jTest path uri digest random pguid
#PACKAGE := b9j-YUI b9j namespace test
#PACKAGE := test
PACKAGE := b9j-YUI b9j namespace test b9jTest path uri digest random pguid chunker
PACKAGE_source := $(PACKAGE:%=%/source.js)
b9j_source := $(filter-out b9jTest, $(PACKAGE))
b9j_source := $(b9j_source:%=%/source.js)
PACKAGE_documentation := $(filter-out b9j-YUI, $(PACKAGE))
PACKAGE_documentation := $(PACKAGE_documentation:%=$(BUILD_documentation)/%.html)
PACKAGE_test := $(PACKAGE:%=$(BUILD_test)/%.html)

all: build

clean:
	rm -rf build

$(yuicompressor_ZIP):
	mkdir -p $(BUILD_tmp)
	wget 'http://www.julienlecomte.net/yuicompressor/yuicompressor-$(yuicompressor_VERSION).zip' -O $(yuicompressor_ZIP)
	touch $@

$(yuicompressor_JAR): $(yuicompressor_ZIP)
	(cd $(BUILD_tmp) && unzip `basename $(yuicompressor_ZIP)`)
	touch $@

# $(BUILD)/b9j.bootstrap.uncompressed.js: b9j-YUI/source.js b9j/source.js namespace/source.js test/source.js
#     cat $^ > $@

$(BUILD)/b9j.bootstrap.uncompressed.js: b9j/source.js namespace/source.js test/source.js
	cat $^ > $@

$(BUILD)/b9j.bootstrap.js: $(BUILD)/b9j.bootstrap.uncompressed.js $(yuicompressor_JAR)
	$(yuicompress) $< -o $@.tmp.js
	$(CHECK_js_syntax) $@.tmp.js
	mv $@.tmp.js $@

$(PACKAGE_documentation): $(BUILD_documentation)/%.html: %/source.js
	mkdir -p $(BUILD_documentation)
	cat $< | ./local/script/doc-simply > $@

$(PACKAGE_test): $(BUILD_test)/%.html: %/test.js test.html
	mkdir -p $(BUILD_test)
	cp $< $@.js
	cp test.html $@
	perl -pi -e 'my $$file = "$@.js"; $$file =~ s/(?:.*\/)?([^\/]+)$$/$$1/; s{\$$TEST}{./$$file}' $@

$(BUILD)/b9j.uncompressed.js: $(b9j_source)
	cat $^ > $@

$(BUILD)/b9j.js: $(BUILD)/b9j.uncompressed.js $(yuicompressor_JAR)
	$(yuicompress) $< -o $@.tmp.js
	$(CHECK_js) $@.tmp.js
	mv $@.tmp.js $@

build: _build $(BUILD)/b9j.bootstrap.js $(BUILD)/b9j.js documentation b9jTest $(PACKAGE_test)

documentation: $(PACKAGE_documentation) $(BUILD_documentation)/b9jTest-example.html $(BUILD_documentation)/license.txt

$(BUILD_documentation)/b9jTest-example.html: b9jTest/example.html
	cp $< $@

$(BUILD_documentation)/license.txt: license.txt
	cp $< $@

wipe: 
	rm -f $(BUILD)/*.js $(BUILD)/*.css
	rm -rf $(BUILD)/documentation $(BUILD)/test

_build:
	mkdir -p $(BUILD)
	for source in $(PACKAGE_source); do $(CHECK_js_syntax) $$source; done

ship: wipe build
	find $(BUILD)/documentation $(BUILD)/test -name static -prune -or -type f -name "*.html"  -print -exec tidy -mi --vertical-space no --tidy-mark no -asxml --wrap 0 {} \;
	rm -rf $(SHIP) $(SHIP_ZIP)
	mkdir -p $(SHIP) $(SHIP)/documentation $(SHIP)/test
	(cd $(BUILD) && cp b9jTest.css b9jTest.js b9j.js b9j.uncompressed.js ../$(SHIP))
	(cd $(BUILD)/documentation && cp * ../../$(SHIP)/documentation)
	(cd $(BUILD)/test && cp * ../../$(SHIP)/test)
	(cd $(BUILD) && zip -r ../$(SHIP_ZIP) `basename $(SHIP)`)
	rm -f $(BUILD)/b9j-latest*
	ln -sf `basename $(SHIP)` $(BUILD)/b9j-latest
	ln -sf `basename $(SHIP_ZIP)` $(BUILD)/b9j-latest.zip

include Makefile.b9jTest
