[**nestjs-typeorm3-kit**](../../README.md)

***

[nestjs-typeorm3-kit](../../README.md) / [repository](../README.md) / DefRepositoryModuleAsyncOptions

# Interface: DefRepositoryModuleAsyncOptions

Defined in: [src/repository/module/index.ts:25](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/module/index.ts#L25)

## Extends

- `Pick`\<`ModuleMetadata`, `"imports"`\>

## Properties

### imports?

> `optional` **imports**: (`Type`\<`any`\> \| `DynamicModule` \| `Promise`\<`DynamicModule`\> \| `ForwardReference`\<`any`\>)[]

Defined in: node\_modules/@nestjs/common/interfaces/modules/module-metadata.interface.d.ts:18

Optional list of imported modules that export the providers which are
required in this module.

#### Inherited from

`Pick.imports`

***

### inject?

> `optional` **inject**: `any`[]

Defined in: [src/repository/module/index.ts:32](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/module/index.ts#L32)

***

### useClass?

> `optional` **useClass**: `Type`\<[`DefRepositoryOptionsFactory`](DefRepositoryOptionsFactory.md)\>

Defined in: [src/repository/module/index.ts:30](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/module/index.ts#L30)

***

### useExisting?

> `optional` **useExisting**: `Type`\<[`DefRepositoryOptionsFactory`](DefRepositoryOptionsFactory.md)\>

Defined in: [src/repository/module/index.ts:31](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/module/index.ts#L31)

***

### useFactory()?

> `optional` **useFactory**: (...`args`) => [`DefRepositoryModuleOptions`](DefRepositoryModuleOptions.md) \| `Promise`\<[`DefRepositoryModuleOptions`](DefRepositoryModuleOptions.md)\>

Defined in: [src/repository/module/index.ts:27](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/module/index.ts#L27)

#### Parameters

##### args

...`any`[]

#### Returns

[`DefRepositoryModuleOptions`](DefRepositoryModuleOptions.md) \| `Promise`\<[`DefRepositoryModuleOptions`](DefRepositoryModuleOptions.md)\>
