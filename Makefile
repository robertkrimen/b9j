.PHONY: all clean b9jTest

yuicompressor_VERSION := 2.3.6
yuicompressor_JAR := yuicompressor-$(yuicompressor_VERSION)/build/yuicompressor-$(yuicompressor_VERSION).jar

PACKAGE := b9j namespace test path
PACKAGE_source := $(PACKAGE:%=%/source.js)
PACKAGE_documentation := $(PACKAGE:%=%/documentation.html)
PACKAGE_test := $(PACKAGE:%=%/test.html)

all: b9j-bootstrap.js b9j.js $(PACKAGE_documentation) b9jTest

clean:
	rm -f */documentation.html

b9j-bootstrap.js: b9j/source.js namespace/source.js test/source.js
	cat $^ > $@

b9j.js: $(PACKAGE_source)
	cat $^ > $@

$(PACKAGE_documentation): %/documentation.html: %/source.js
	cat $< | ./local/script/doc-simply > $@

yuicompressor-$(yuicompressor_VERSION).zip:
	wget 'http://www.julienlecomte.net/yuicompressor/yuicompressor-$(yuicompressor_VERSION).zip'

$(yuicompressor_JAR): yuicompressor-$(yuicompressor_VERSION).zip
	unzip $<

yuicompressor.jar: $(yuicompressor_JAR)
	ln -snf $< $@

b9jTest:
	$(MAKE) -C $@
