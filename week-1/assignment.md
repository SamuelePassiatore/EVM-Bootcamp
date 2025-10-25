# Report

// ATTEMPTS SUCCESSED

- Contract Address: `0x50C1Cefec528C08a2F85b72D6C51Ce945Ec5ac7c`

## Execution 1 - setted a new string

- wallet Address: `0x50585f280F9b1CaEf186eE6E9cBBAB65a5fC39Eb`
- executed Function: `helloWorld`

Function: setText(string newText) ***
MethodID: 0x5d3a1f9d
[0]:  0000000000000000000000000000000000000000000000000000000000000020
[1]:  000000000000000000000000000000000000000000000000000000000000000d
[2]:  68656c6c6f2067726f7570203600000000000000000000000000000000000000

```json
{
  "0": "string: hello group 6"
}
```

## Execution 2 - Transfer Ownership

- wallet Address: `0x50585f280F9b1CaEf186eE6E9cBBAB65a5fC39Eb`
- executed Function: `Transfer Ownership`
- transaction hash: `0x5fa88e212eebb7a6a06abdcce022f8edfd3bada971f16dab92b6bcb5addb9bef`
- block hash: `0xa82bad0dc175759f1456e4bcc68d5f69383515bd618866ed832719ae6f1c2250`

Function: transferOwnership(address newOwner) ***
MethodID: 0xf2fde38b
[0]:  00000000000000000000000086fd0d762b53f21011e531fa57629d294d576a36

```json
{
  "newOwner": "0x86fd0D762B53f21011e531fa57629D294d576A36"
}
```


## Execution 3 - A new owner setted new string text

- wallet Address: `0x86fd0D762B53f21011e531fa57629D294d576A36`
- executed Function: `Set Text`
- transaction hash: `0xe5d7e40c7b06291d03c0e5484e218ba4de560b6bdf6801a2c15bd87950fff52d`
- block hash: `0xf7bb2fc642b157d92cb2248289b8e7db9cc73578e262c134bd260a1190ec3b95`

Function: setText(string newText) ***

MethodID: 0x5d3a1f9d
[0]:  0000000000000000000000000000000000000000000000000000000000000020
[1]:  0000000000000000000000000000000000000000000000000000000000000014
[2]:  69276d20746865206e6577206f776e6572202121000000000000000000000000

```json
{
  "0": "i'm the new owner !!"
}
```

## Execution 4 - A new owner transferred Ownership to another wallet address

- wallet Address: `0x86fd0D762B53f21011e531fa57629D294d576A36`
- executed Function: `Transfer Ownership`
- transaction hash: `0x10297373c8a1af0f08e6bbeeb9086b55d2913e4727a780291af74845e7ff0f5c`
- block hash: `0x81582aa6f9f0a60379a31797387e18666ad47a36872724cb4e14208a1a48ff0d`

Function: transferOwnership(address newOwner) ***
MethodID: 0xf2fde38b
[0]:  00000000000000000000000050585f280f9b1caef186ee6e9cbbab65a5fc39eb

```json
{
  "newOwner": "0x50585f280F9b1CaEf186eE6E9cBBAB65a5fC39Eb"
}
```


// ATTEMPTS FAILED

## Execution 5 - The last owner setted new string text

- wallet Address: `0x86fd0D762B53f21011e531fa57629D294d576A36`
- executed Function: `Set Text`
- transaction hash: `0x0658166acb4bd683b019eacb4a0b3f08250a39223405db69c77120dcc0240e44`
- block hash: `0x0b6f0fda7dcc07fde27925c72e5012c0cfe5c88317c39f553e8797181537ea61`

Function: setText(string newText) ***

MethodID: 0x5d3a1f9d
[0]:  0000000000000000000000000000000000000000000000000000000000000020
[1]:  0000000000000000000000000000000000000000000000000000000000000014
[2]:  69276d20746865206e6577206f776e6572202121000000000000000000000000

```json
{
  "0": "I'm the new owner !!"
}
```

## Execution 6 - The last owner try to transferred Ownership to another wallet address

- wallet Address: `0x86fd0D762B53f21011e531fa57629D294d576A36`
- executed Function: `Transfer Ownership`
- transaction hash: `0x954ac2f1077136ee54b2fc70e1068abfa648bd0079f49315704e1ded8c4f19af`
- block hash: `0xf7156d0cf77ca9f4c141a3c9a66ea8b7cb5650f758e9234680336091305048ad`

Function: transferOwnership(address newOwner) ***
MethodID: 0xf2fde38b
[0]:  00000000000000000000000050585f280f9b1caef186ee6e9cbbab65a5fc39eb
```json
{
  "newOwner": "no new owner setted"
}
```





