// Copyright © 2017 DWANGO Co., Ltd.

describe("ObjectChannelWrapperSpec", function() {
    var oc = require("../lib/ObjectChannelWrapper.js");
    var objectChannel;
    var dummyDataBus = new Object();
    var hoge;
    var remoteObject;

    it("constructor", function() {
        var counter = 0;
        dummyDataBus.addHandler = function() {
            console.log("DataBus#addHandler: " + JSON.stringify(arguments));
            counter++;
        }
        objectChannel = new oc.ObjectChannelWrapper(dummyDataBus);
        expect(1).toEqual(counter);
    });

    it("bind", function() {
        objectChannel.bind(function Hoge() {
            function Hoge() {
                hoge = "called: Hoge#constructor";
                console.log(hoge);
            }
            function foo() {
                hoge = "called: Hoge#foo";
                console.log(hoge);
            }
        })
    });

    it("unbind", function() {
        objectChannel.unbind("Hoge");
    });

    it("create", function() {
        dummyDataBus.send = function() {
            hoge = "DataBus#send: " + JSON.stringify(arguments);
            console.log(hoge);
        }
        objectChannel.create("HogeRemote", [], function(err, obj) {
        });
        expect("DataBus#send: {\"0\":2,\"1\":[\"c:1\",[\"omi\",[\"$obj\",\"create\",[\"HogeRemote\",[]]]]]}").toEqual(hoge);
    });

    it("destroy", function() {
        expect(objectChannel.destroyed()).toBeFalsy();
        var counter = 0;
        dummyDataBus.removeHandler = function() {
            console.log("DataBus#removeHandler: " + JSON.stringify(arguments));
            counter += 8;
        }
        objectChannel.destroy();
        expect(8).toEqual(counter);
        expect(objectChannel.destroyed()).toBeTruthy();
        objectChannel.bind();
        objectChannel.unbind();
        objectChannel.create();
    });
});
