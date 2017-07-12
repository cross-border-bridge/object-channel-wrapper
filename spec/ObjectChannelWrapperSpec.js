// Copyright © 2017 DWANGO Co., Ltd.

describe("ObjectChannelWrapperSpec", function() {
    var oc = require("../lib/ObjectChannelWrapper.js");
    var db = require("../node_modules/@cross-border-bridge/memory-queue-data-bus/lib/index.js");
    var mq = require("../node_modules/@cross-border-bridge/memory-queue/lib/index.js");
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
        objectChannel.create("HogeRemote", [], function(err, obj) {});
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

    it("combined-test", function() {
        var mq1 = new mq.MemoryQueue();
        var mq2 = new mq.MemoryQueue();

        // 送信側ObjectChannelWrapperを作成
        var dataBusS = new db.MemoryQueueDataBus(mq1, mq2);
        var objectChannelS = new oc.ObjectChannelWrapper(dataBusS);

        // 受信側ObjectChannelWrapperを作成
        var dataBusR = new db.MemoryQueueDataBus(mq2, mq1);
        var objectChannelR = new oc.ObjectChannelWrapper(dataBusR);

        // 受信側ObjectChannelに登録するクラス(MyClassJS)を準備
        var MyClassJS = (function() {
            function MyClassJS() {}
            MyClassJS.prototype.foo = function(a1, a2, a3) {
                return a1 + a2 + a3;
            };
            MyClassJS.prototype.fooA = function(a1, a2, a3) {
                return function(callback) {
                    callback(a1 + a2 + a3);
                }
            };
            return MyClassJS;
        })();
        objectChannelR.bind(MyClassJS);

        // 送信側からMyClassJSをインスタンス化
        objectChannelS.create("MyClassJS", [], function(error, remoteObject) {
            // fooを実行
            remoteObject.invoke("foo", ["One", "Two", "Three"], function(error, result) {
                console.log("foo: " + result);
                expect("OneTwoThree").toEqual(result);
            });
            // fooAを実行
            remoteObject.invoke("fooA", ["Ichi", "Ni", "Sun"], function(error, result) {
                console.log("fooA: " + result);
                expect("IchiNiSun").toEqual(result);
            });
            // 破棄
            remoteObject.destroy();
        });

        // 破棄
        objectChannelR.unbind(MyClassJS);
        objectChannelR.destroy();
        dataBusR.destroy();
        objectChannelS.destroy();
        dataBusS.destroy();
    });
});