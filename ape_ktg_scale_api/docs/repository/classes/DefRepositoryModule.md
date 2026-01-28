[**nestjs-typeorm3-kit**](../../README.md)

***

[nestjs-typeorm3-kit](../../README.md) / [repository](../README.md) / DefRepositoryModule

# Class: DefRepositoryModule

Defined in: [src/repository/module/index.ts:55](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/module/index.ts#L55)

## Constructors

### Constructor

> **new DefRepositoryModule**(): `DefRepositoryModule`

#### Returns

`DefRepositoryModule`

## Methods

### forFeature()

> `static` **forFeature**(`repositories`, `dataSource?`): `DynamicModule`

Defined in: [src/repository/module/index.ts:59](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/module/index.ts#L59)

Manual registration for feature modules

#### Parameters

##### repositories

[`Repository`](../interfaces/Repository.md)[]

##### dataSource?

`string` | `DataSource` | `DataSourceOptions`

#### Returns

`DynamicModule`

***

### forRoot()

> `static` **forRoot**(`options`): `Promise`\<`DynamicModule`\>

Defined in: [src/repository/module/index.ts:70](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/module/index.ts#L70)

Root async registration using glob pattern

#### Parameters

##### options

[`DefRepositoryModuleOptions`](../interfaces/DefRepositoryModuleOptions.md)

#### Returns

`Promise`\<`DynamicModule`\>

***

### forRootAsync()

> `static` **forRootAsync**(`options`): `Promise`\<`DynamicModule`\>

Defined in: [src/repository/module/index.ts:84](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/module/index.ts#L84)

Asynchronous DI-based registration

#### Parameters

##### options

[`DefRepositoryModuleAsyncOptions`](../interfaces/DefRepositoryModuleAsyncOptions.md)

#### Returns

`Promise`\<`DynamicModule`\>
