.PHONY: all clean

PACKAGE := b9j namespace test path
PACKAGE_source := $(PACKAGE:%=%/source.js)
PACKAGE_documentation := $(PACKAGE:%=%/documentation.html)
PACKAGE_test := $(PACKAGE:%=%/test.html)

all: b9j-bootstrap.js b9j.js $(PACKAGE_documentation)

clean:
	rm -f */documentation.html

b9j-bootstrap.js: b9j/source.js namespace/source.js test/source.js
	cat $^ > $@

b9j.js: $(PACKAGE_source)
	cat $^ > $@

$(PACKAGE_documentation): %/documentation.html: %/source.js
	cat $< | ./local/script/doc-simply > $@
