[**nestjs-typeorm3-kit**](../../README.md)

***

[nestjs-typeorm3-kit](../../README.md) / [validate](../README.md) / IValidationOptions

# Interface: IValidationOptions

Defined in: [src/validate/decorator/index.ts:12](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/validate/decorator/index.ts#L12)

## Extends

- `ValidationOptions`

## Properties

### always?

> `optional` **always**: `boolean`

Defined in: node\_modules/class-validator/types/decorator/ValidationOptions.d.ts:22

Indicates if validation must be performed always, no matter of validation groups used.

#### Inherited from

`ValidationOptions.always`

***

### context?

> `optional` **context**: `any`

Defined in: node\_modules/class-validator/types/decorator/ValidationOptions.d.ts:23

#### Inherited from

`ValidationOptions.context`

***

### each?

> `optional` **each**: `boolean`

Defined in: node\_modules/class-validator/types/decorator/ValidationOptions.d.ts:9

Specifies if validated value is an array and each of its items must be validated.

#### Inherited from

`ValidationOptions.each`

***

### groups?

> `optional` **groups**: `string`[]

Defined in: node\_modules/class-validator/types/decorator/ValidationOptions.d.ts:18

Validation groups used for this validation.

#### Inherited from

`ValidationOptions.groups`

***

### message?

> `optional` **message**: `string` \| (`validationArguments`) => `string`

Defined in: node\_modules/class-validator/types/decorator/ValidationOptions.d.ts:14

Error message to be used on validation fail.
Message can be either string or a function that returns a string.

#### Inherited from

`ValidationOptions.message`

***

### required?

> `optional` **required**: `boolean`

Defined in: [src/validate/decorator/index.ts:13](https://github.com/x302502/nestjs-typeorm3-kit/blob/6ef69742f766c1a8d18cd622a628a96085a8d4cc/src/validate/decorator/index.ts#L13)
