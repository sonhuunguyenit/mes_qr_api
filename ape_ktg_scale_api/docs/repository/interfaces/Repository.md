[**nestjs-typeorm3-kit**](../../README.md)

***

[nestjs-typeorm3-kit](../../README.md) / [repository](../README.md) / Repository

# Interface: Repository

Defined in: [src/repository/config/types.ts:9](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/config/types.ts#L9)

## Extends

- `Function`

## Constructors

### Constructor

> **new Repository**(`target`, `manager`, `queryRunner?`): `Repository`\<`ObjectLiteral`\>

Defined in: [src/repository/config/types.ts:10](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/repository/config/types.ts#L10)

#### Parameters

##### target

`EntityTarget`\<`any`\>

##### manager

`EntityManager`

##### queryRunner?

`QueryRunner`

#### Returns

`Repository`\<`ObjectLiteral`\>

#### Inherited from

`Function.constructor`

## Properties

### arguments

> **arguments**: `any`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:305

#### Inherited from

`Function.arguments`

***

### caller

> **caller**: `Function`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:306

#### Inherited from

`Function.caller`

***

### length

> `readonly` **length**: `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:302

#### Inherited from

`Function.length`

***

### name

> `readonly` **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:97

Returns the name of the function. Function names are read-only and can not be changed.

#### Inherited from

`Function.name`

***

### prototype

> **prototype**: `any`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:301

#### Inherited from

`Function.prototype`

## Methods

### \[hasInstance\]()

> **\[hasInstance\]**(`value`): `boolean`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:164

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

#### Parameters

##### value

`any`

#### Returns

`boolean`

#### Inherited from

`Function.[hasInstance]`

***

### apply()

> **apply**(`this`, `thisArg`, `argArray?`): `any`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:281

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

#### Parameters

##### this

`Function`

##### thisArg

`any`

The object to be used as the this object.

##### argArray?

`any`

A set of arguments to be passed to the function.

#### Returns

`any`

#### Inherited from

`Function.apply`

***

### bind()

> **bind**(`this`, `thisArg`, ...`argArray`): `any`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:296

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

#### Parameters

##### this

`Function`

##### thisArg

`any`

An object to which the this keyword can refer inside the new function.

##### argArray

...`any`[]

A list of arguments to be passed to the new function.

#### Returns

`any`

#### Inherited from

`Function.bind`

***

### call()

> **call**(`this`, `thisArg`, ...`argArray`): `any`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:288

Calls a method of an object, substituting another object for the current object.

#### Parameters

##### this

`Function`

##### thisArg

`any`

The object to be used as the current object.

##### argArray

...`any`[]

A list of arguments to be passed to the method.

#### Returns

`any`

#### Inherited from

`Function.call`

***

### toString()

> **toString**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:299

Returns a string representation of a function.

#### Returns

`string`

#### Inherited from

`Function.toString`
