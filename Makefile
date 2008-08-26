.PHONY: all clean build _build ship documentation

BUILD := build
BUILD_tmp := build/tmp
BUILD_documentation := build/documentation

b9j_VERSION := 0.1.0
SHIP := $(BUILD)/b9j-$(b9j_VERSION)
SHIP_ZIP := $(BUILD)/b9j-$(b9j_VERSION).zip

yuicompressor_VERSION := 2.3.6
yuicompressor_JAR := $(BUILD_tmp)/yuicompressor-$(yuicompressor_VERSION)/$(BUILD)/yuicompressor-$(yuicompressor_VERSION).jar
yuicompressor_ZIP := $(BUILD_tmp)/yuicompressor-$(yuicompressor_VERSION).zip
yuicompress := java -jar $(yuicompressor_JAR)

PACKAGE := b9j namespace test b9jTest
PACKAGE_source := $(PACKAGE:%=%/source.js)
PACKAGE_documentation := $(PACKAGE:%=$(BUILD_documentation)/%.html)
PACKAGE_test := $(PACKAGE:%=%/test.html)

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

$(BUILD)/b9j.bootstrap.uncompressed.js: b9j/source.js namespace/source.js test/source.js
	cat $^ > $@

$(BUILD)/b9j.bootstrap.js: $(BUILD)/b9j.bootstrap.uncompressed.js $(yuicompressor_JAR)
	$(yuicompress) $< -o $@

$(PACKAGE_documentation): $(BUILD_documentation)/%.html: %/source.js
	mkdir -p $(BUILD_documentation)
	cat $< | ./local/script/doc-simply > $@

$(BUILD)/b9j.uncompressed.js: $(PACKAGE_source)
	cat $^ > $@

$(BUILD)/b9j.js: $(BUILD)/b9j.uncompressed.js $(yuicompressor_JAR)
	$(yuicompress) $< -o $@

build: _build $(BUILD)/b9j.bootstrap.js $(BUILD)/b9j.js documentation b9jTest

documentation: $(PACKAGE_documentation) $(BUILD_documentation)/b9jTest-example.html

$(BUILD_documentation)/b9jTest-example.html: b9jTest/example.html
	cp $< $@

wipe: 
	rm -f $(BUILD)/*.js $(BUILD)/*.css
	rm -rf $(BUILD)/documentation

_build:
	mkdir -p $(BUILD)

ship: wipe build
	rm -rf $(SHIP) $(SHIP_ZIP)
	mkdir -p $(SHIP) $(SHIP)/documentation
	(cd $(BUILD) && cp b9jTest.css b9jTest.js b9j.js b9j.uncompressed.js ../$(SHIP))
	(cd $(BUILD)/documentation && cp * ../../$(SHIP)/documentation)
	(cd $(BUILD) && zip -r ../$(SHIP_ZIP) `basename $(SHIP)`)
	rm -f $(BUILD)/b9j-latest*
	ln -sf `basename $(SHIP)` $(BUILD)/b9j-latest
	ln -sf `basename $(SHIP_ZIP)` $(BUILD)/b9j-latest.zip

include Makefile.b9jTest
