// Copyright © 2017 DWANGO Co., Ltd.

import * as db from "@cross-border-bridge/data-bus";
import * as dc from "@cross-border-bridge/data-channel";
import * as fc from "@cross-border-bridge/function-channel";
import * as oc from "@cross-border-bridge/object-channel";

export class ObjectChannelWrapper {
    private _dataBus: db.DataBus;
    private _dataChannel: dc.DataChannel;
    private _functionChannel: fc.FunctionChannel;
    private _objectChannel: oc.ObjectChannel;

    constructor(dataBus: db.DataBus) {
        this._dataBus = dataBus;
        this._dataChannel = new dc.DataChannel(this._dataBus);
        this._functionChannel = new fc.FunctionChannel(this._dataChannel);
        this._objectChannel = new oc.ObjectChannel(this._functionChannel);
    }

    bind(classFunction: any): void {
        if (!this._objectChannel) return;
        this._objectChannel.bind(classFunction);
    }

    unbind(classFunction: any): void {
        if (!this._objectChannel) return;
        this._objectChannel.unbind(classFunction);
    }

    create(className: string, args: any[], callback: oc.ObjectChannelCallback, timeout?: number): void {
        if (!this._objectChannel) return;
        this._objectChannel.create(className, args, callback, timeout);
    }

    destroy() {
        this._objectChannel.destroy();
        this._objectChannel = undefined;
        this._functionChannel.destroy();
        this._functionChannel = undefined;
        this._dataChannel.destroy();
        this._dataChannel = undefined;
        this._dataBus = undefined;
    }

    destroyed(): boolean {
        return !this._objectChannel;
    }
}