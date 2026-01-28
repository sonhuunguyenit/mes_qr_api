[**nestjs-typeorm3-kit**](../../README.md)

***

[nestjs-typeorm3-kit](../../README.md) / [module](../README.md) / IChildModuleMetadata

# Interface: IChildModuleMetadata

Defined in: [src/module/decorator/index.ts:6](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/module/decorator/index.ts#L6)

## Extends

- `ModuleMetadata`

## Properties

### controllers?

> `optional` **controllers**: `Type`\<`any`\>[]

Defined in: node\_modules/@nestjs/common/interfaces/modules/module-metadata.interface.d.ts:23

Optional list of controllers defined in this module which have to be
instantiated.

#### Inherited from

`ModuleMetadata.controllers`

***

### exports?

> `optional` **exports**: (`string` \| `symbol` \| `Function` \| `DynamicModule` \| `ForwardReference`\<`any`\> \| `Abstract`\<`any`\> \| `Provider`)[]

Defined in: node\_modules/@nestjs/common/interfaces/modules/module-metadata.interface.d.ts:33

Optional list of the subset of providers that are provided by this module
and should be available in other modules which import this module.

#### Inherited from

`ModuleMetadata.exports`

***

### imports?

> `optional` **imports**: (`Type`\<`any`\> \| `DynamicModule` \| `Promise`\<`DynamicModule`\> \| `ForwardReference`\<`any`\>)[]

Defined in: node\_modules/@nestjs/common/interfaces/modules/module-metadata.interface.d.ts:18

Optional list of imported modules that export the providers which are
required in this module.

#### Inherited from

`ModuleMetadata.imports`

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [src/module/decorator/index.ts:7](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/module/decorator/index.ts#L7)

***

### providers?

> `optional` **providers**: `Provider`[]

Defined in: node\_modules/@nestjs/common/interfaces/modules/module-metadata.interface.d.ts:28

Optional list of providers that will be instantiated by the Nest injector
and that may be shared at least across this module.

#### Inherited from

`ModuleMetadata.providers`
