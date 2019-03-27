[redux-data-service-react](../README.md) > [IFieldInputProps](../interfaces/ifieldinputprops.md)

# Interface: IFieldInputProps

## Hierarchy

**IFieldInputProps**

## Index

### Properties

* [name](ifieldinputprops.md#name)
* [onBlur](ifieldinputprops.md#onblur)
* [onChange](ifieldinputprops.md#onchange)
* [onFieldError](ifieldinputprops.md#onfielderror)
* [onFocus](ifieldinputprops.md#onfocus)
* [value](ifieldinputprops.md#value)

---

## Properties

<a id="name"></a>

###  name

**● name**: *`string`*

*Defined in [Components/ModelField.tsx:19](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L19)*

___
<a id="onblur"></a>

### `<Optional>` onBlur

**● onBlur**: *`function`*

*Defined in [Components/ModelField.tsx:21](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L21)*

#### Type declaration
▸<`T`>(event?: *`FocusEvent`<`T`>*): `void`

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` event | `FocusEvent`<`T`> |

**Returns:** `void`

___
<a id="onchange"></a>

###  onChange

**● onChange**: *`function`*

*Defined in [Components/ModelField.tsx:20](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L20)*

#### Type declaration
▸<`T`>(event: *`ChangeEvent`<`T`> \| `any`*): `void`

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `ChangeEvent`<`T`> \| `any` |

**Returns:** `void`

___
<a id="onfielderror"></a>

### `<Optional>` onFieldError

**● onFieldError**: *`function`*

*Defined in [Components/ModelField.tsx:23](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L23)*

#### Type declaration
▸(error: *`string`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| error | `string` |

**Returns:** `void`

___
<a id="onfocus"></a>

### `<Optional>` onFocus

**● onFocus**: *`function`*

*Defined in [Components/ModelField.tsx:22](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L22)*

#### Type declaration
▸<`T`>(event?: *`FocusEvent`<`T`>*): `void`

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` event | `FocusEvent`<`T`> |

**Returns:** `void`

___
<a id="value"></a>

### `<Optional>` value

**● value**: *`any`*

*Defined in [Components/ModelField.tsx:24](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L24)*

___

