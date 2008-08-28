    var Assert = YAHOO.util.Assert;
    var Test = YAHOO.lang;
     
    YAHOO.util.Event.onDOMReady(function(){

        var logger = new YAHOO.tool.TestLogger("testLogger");

        YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({

            name: "b9j/b9j Test",

            setUp: function() {
            },
        
            tearDown: function() {
            },
        
            testNamespace: function() {
            },
        }));    

        YAHOO.tool.TestRunner.run();
    });
