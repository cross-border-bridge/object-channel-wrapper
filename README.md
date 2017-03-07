# object-channel-wrapper
- ObjectChannelWrapperのTypeScript用の実装を提供します
- ObjectChannelWrapperはFunctionChannelとDataChannelのレイヤを隠蔽したObjectChannelのラッパーです
- Node.jsで利用することを想定しています

## Setup
### package.json
```
    "dependencies": {
        "@cross-border-bridge/object-channel-wrapper": "~2.0.0"
    },
```

## Usage
#### step 1: import

```typescript
import * as oc from "@cross-border-bridge/object-channel-wrapper";
```

#### step 2: ObjectChannelWrapperを準備
使用するDataBusインスタンスを指定してObjectChannelWrapperを生成します。

```typescript
    var objectChannel: oc.ObjectChannelWrapper = new oc.ObjectChannelWrapper(dataBus);
```

#### step 3: ObjectChannelWrapperの利用 
- ObjectChannelWrapper は ObjectChannel と同等のインタフェースで利用できます
- 詳しい利用方法は ObjectChannel のドキュメントを参照してください

## License
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](LICENSE) をご覧ください。
