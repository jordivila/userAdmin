
var testSetup = {
    
    begin       : function (data) /* before any tests start */ {
        console.log("begin: [" + new Date().toLocaleTimeString() + "]");
    },
    moduleStart : function (data) /* before the start of each module */ {
        console.log("-------\n  moduleStart:", data.name);
    },
    testStart   : function (data) /* before the start of each test */ {
        
        jQuery
        .get(server.getBaseAddress() + "/initDb")
            .done(function (result, textStatus, jqXHR) {
            ok(result.isValid === true, "Drop Database & Init");
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
            ok(false, "Unhandled error initiating db. TextStatus->" + textStatus + " / errorThrown->" + errorThrown);
        });


    },
    log         : function (data) /* called after every assertion */ {
        console.log("      log:", data.message);
    },
    testDone    : function (data) /* after each test */ {
        console.log("    testDone:", data);
    },
    moduleDone  : function (data) /* after each module */ {
        console.log("  moduleDone:", data);
    },
    done        : function (data) /* all tests done */ {
        console.log("done:", data);
    },
    
    init : function () {
        console.log("\n======== QUnit events initialized ==========");
        
        QUnit.begin(testSetup.begin);
        QUnit.moduleStart(testSetup.moduleStart);
        QUnit.testStart(testSetup.testStart);
        QUnit.log(testSetup.log);
        QUnit.testDone(testSetup.testDone);
        QUnit.moduleDone(testSetup.moduleDone);
        QUnit.done(testSetup.done);
        
    }
};

testSetup.init();

