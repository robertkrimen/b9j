.PHONY: all

yui_VERSION := 2.5.2

all: b9jTest.js b9jTest.css

b9jTest.js: b9jTest.uncompressed.js ../yuicompressor.jar
	java -jar ../yuicompressor.jar $< > $@

b9jTest.css: b9jTest.uncompressed.css ../yuicompressor.jar
	java -jar ../yuicompressor.jar $< > $@

b9jTest.uncompressed.js: yahoo-dom-event.js logger-min.js yuitest-min.js container-min.js ../b9j.js ./source.js
	cat $^ > $@

yahoo-dom-event.js:
	wget 'http://yui.yahooapis.com/$(yui_VERSION)/build/yahoo-dom-event/yahoo-dom-event.js' -O $@

logger-min.js:
	wget 'http://yui.yahooapis.com/$(yui_VERSION)/build/logger/logger-min.js' -O $@

yuitest-min.js:
	wget 'http://yui.yahooapis.com/$(yui_VERSION)/build/yuitest/yuitest-min.js' -O $@

container-min.js:
	wget 'http://yui.yahooapis.com/$(yui_VERSION)/build/container/container-min.js' -O $@

b9jTest.uncompressed.css: reset-fonts-grids.css base-min.css logger.css yuitest.css ./source.css
	cat $^ > $@

reset-fonts-grids.css:
	wget 'http://yui.yahooapis.com/$(yui_VERSION)/build/reset-fonts-grids/reset-fonts-grids.css' -O $@

base-min.css:
	wget 'http://yui.yahooapis.com/$(yui_VERSION)/build/base/base-min.css' -O $@

logger.css:
	wget 'http://yui.yahooapis.com/$(yui_VERSION)/build/logger/assets/skins/sam/logger.css' -O $@

yuitest.css:
	wget 'http://yui.yahooapis.com/$(yui_VERSION)/build/yuitest/assets/skins/sam/yuitest.css' -O $@
