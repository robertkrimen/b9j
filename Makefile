.PHONY: all clean b9jTest build

yuicompressor_VERSION := 2.3.6
yuicompressor_JAR := yuicompressor-$(yuicompressor_VERSION)/build/yuicompressor-$(yuicompressor_VERSION).jar

PACKAGE := b9j namespace test path b9jTest
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
	unzip -o $<

yuicompressor.jar: $(yuicompressor_JAR)
	ln -snf $< $@

b9jTest:
	$(MAKE) -C $@

build: b9j.js yuicompressor.jar b9jTest
	mkdir -p $@
	cp b9jTest/b9jTest.{js,css} $@
	java -jar yuicompressor.jar b9j.js -o $@/b9j.js
