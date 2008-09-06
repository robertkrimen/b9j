b9jTest(function(test) {
    
    var gotten;
    try {
        gotten = b9j.environment.detect();
    }
    catch (thrown) { if (console) console.log(thrown); else alert(thrown); }
    var output = function() {
        $("#output").get(0).innerHTML += Array.prototype.slice.call(arguments).join("");
    }
    output("\nuser_agent ", gotten.user_agent);
    output("\nbrowser ", gotten.browser);
    output("\nbrowser_version ", gotten.browser_version);
    output("\nbrowser_engine ", gotten.engine);
    output("\nbrowser_engine_version ", gotten.engine_version);
    output("\nplatform ", gotten.platform);
    output("\nplatform_version ", gotten.platform_version);
    output("\nmobile ", gotten.mobile);
    test.is(1, 1);
});
