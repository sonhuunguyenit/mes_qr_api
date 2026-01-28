[**nestjs-typeorm3-kit**](../../README.md)

***

[nestjs-typeorm3-kit](../../README.md) / [transaction](../README.md) / DefTransaction

# Function: DefTransaction()

> **DefTransaction**(`options?`): `MethodDecorator`

Defined in: [src/transaction/decorator/index.ts:8](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/transaction/decorator/index.ts#L8)

Transactional decorator

## Parameters

### options?

#### connectionName?

`string` \| () => `string`

#### isoLevel?

`"READ_UNCOMMITTED"` \| `"READ_COMMITTED"` \| `"REPEATABLE_READ"` \| `"SERIALIZABLE"`

#### propagation?

`Propagation`

## Returns

`MethodDecorator`
