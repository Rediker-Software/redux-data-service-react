[redux-data-service-react](../README.md) > [IModelFieldProps](../interfaces/imodelfieldprops.md)

# Interface: IModelFieldProps

## Type parameters
#### T 
## Hierarchy

 `object`

**↳ IModelFieldProps**

## Indexable

\[otherProp: `string`\]:&nbsp;`any`
## Index

### Properties

* [component](imodelfieldprops.md#component)
* [componentProps](imodelfieldprops.md#componentprops)
* [defaultValue](imodelfieldprops.md#defaultvalue)
* [fieldComponent](imodelfieldprops.md#fieldcomponent)
* [readOnlyComponent](imodelfieldprops.md#readonlycomponent)
* [readOnlyComponentProps](imodelfieldprops.md#readonlycomponentprops)
* [readOnlyFieldName](imodelfieldprops.md#readonlyfieldname)
* [validateField](imodelfieldprops.md#validatefield)

---

## Properties

<a id="component"></a>

### `<Optional>` component

**● component**: *`React.ComponentType`<[IFieldInputProps](ifieldinputprops.md) & `any`>*

*Defined in [Components/ModelField.tsx:33](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L33)*

___
<a id="componentprops"></a>

### `<Optional>` componentProps

**● componentProps**: *`function` \| `Partial`<`T`>*

*Defined in [Components/ModelField.tsx:34](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L34)*

___
<a id="defaultvalue"></a>

### `<Optional>` defaultValue

**● defaultValue**: *`any`*

*Defined in [Components/ModelField.tsx:30](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L30)*

___
<a id="fieldcomponent"></a>

### `<Optional>` fieldComponent

**● fieldComponent**: *`React.ComponentType`<[IFieldInputProps](ifieldinputprops.md) & `any`>*

*Defined in [Components/ModelField.tsx:32](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L32)*

___
<a id="readonlycomponent"></a>

### `<Optional>` readOnlyComponent

**● readOnlyComponent**: *`React.ComponentType`<[IFieldInputProps](ifieldinputprops.md) & `any`>*

*Defined in [Components/ModelField.tsx:36](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L36)*

___
<a id="readonlycomponentprops"></a>

### `<Optional>` readOnlyComponentProps

**● readOnlyComponentProps**: *`function` \| `Partial`<`T`>*

*Defined in [Components/ModelField.tsx:37](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L37)*

___
<a id="readonlyfieldname"></a>

### `<Optional>` readOnlyFieldName

**● readOnlyFieldName**: *`string`*

*Defined in [Components/ModelField.tsx:28](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L28)*

___
<a id="validatefield"></a>

### `<Optional>` validateField

**● validateField**: *`function`*

*Defined in [Components/ModelField.tsx:29](https://github.com/Rediker-Software/redux-data-service-react/blob/ee57350/src/Components/ModelField.tsx#L29)*

#### Type declaration
▸(model: *`IModel`<`any`>*, name: *`string`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| model | `IModel`<`any`> |
| name | `string` |

**Returns:** `void`

___

