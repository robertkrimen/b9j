.PHONY: all clean build _build

BUILD := build
BUILD_tmp := build/tmp
BUILD_documentation := build/documentation

yuicompressor_VERSION := 2.3.6
yuicompressor_JAR := yuicompressor-$(yuicompressor_VERSION)/$(BUILD)/yuicompressor-$(yuicompressor_VERSION).jar

PACKAGE := b9j namespace test path b9jTest
PACKAGE_source := $(PACKAGE:%=%/source.js)
PACKAGE_documentation := $(PACKAGE:%=$(BUILD_documentation)/%.html)
PACKAGE_test := $(PACKAGE:%=%/test.html)

all: build

clean:
	rm -rf build

yuicompressor-$(yuicompressor_VERSION).zip:
	wget 'http://www.julienlecomte.net/yuicompressor/yuicompressor-$(yuicompressor_VERSION).zip'

$(yuicompressor_JAR): yuicompressor-$(yuicompressor_VERSION).zip
	unzip -o $<

yuicompressor.jar: $(yuicompressor_JAR)
	ln -snf $< $@

$(BUILD)/b9j.bootstrap.uncompressed.js: b9j/source.js namespace/source.js test/source.js
	cat $^ > $@

$(BUILD)/b9j.bootstrap.js: $(BUILD)/b9j.bootstrap.uncompressed.js
	java -jar yuicompressor.jar $< -o $@

$(PACKAGE_documentation): $(BUILD_documentation)/%.html: %/source.js
	cat $< | ./local/script/doc-simply > $@

$(BUILD)/b9j.uncompressed.js: $(PACKAGE_source)
	cat $^ > $@

$(BUILD)/b9j.js: $(BUILD)/b9j.uncompressed.js
	java -jar yuicompressor.jar $< -o $@

build: _build $(BUILD)/b9j.bootstrap.js $(BUILD)/b9j.js $(PACKAGE_documentation) b9jTest

_build:
	mkdir -p $(BUILD) $(BUILD_tmp) $(BUILD_documentation)

include Makefile.b9jTest
