

## Index

### Classes

* [FakeComponent](classes/fakecomponent.md)

### Interfaces

* [IConfiguration](interfaces/iconfiguration.md)
* [IFakeComponentProps](interfaces/ifakecomponentprops.md)
* [IQueryProps](interfaces/iqueryprops.md)
* [IShowLoadingIndicator](interfaces/ishowloadingindicator.md)
* [IWithLoadingIndicatorProps](interfaces/iwithloadingindicatorprops.md)
* [IWithModelQueryOptions](interfaces/iwithmodelqueryoptions.md)
* [IWithModelQueryProps](interfaces/iwithmodelqueryprops.md)

### Variables

* [Query](#query)

### Functions

* [DefaultLoadingComponent](#defaultloadingcomponent)
* [configure](#configure)
* [defaultShowLoadingIndicator](#defaultshowloadingindicator)
* [getConfiguration](#getconfiguration)
* [usingMount](#usingmount)
* [withLoadingIndicator](#withloadingindicator)
* [withModel](#withmodel)
* [withModelArray](#withmodelarray)
* [withModelQuery](#withmodelquery)
* [withNewModel](#withnewmodel)

### Object literals

* [configuration](#configuration)

---

## Variables

<a id="query"></a>

### `<Const>` Query

**● Query**: * `ComponentClass`<[IQueryProps](interfaces/iqueryprops.md)> &#124; `StatelessComponent`<[IQueryProps](interfaces/iqueryprops.md)>
* =  withRenderProps<IQueryProps>(withModelQuery())

*Defined in [Query.tsx:12](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/Query.tsx#L12)*

___

## Functions

<a id="defaultloadingcomponent"></a>

### `<Const>` DefaultLoadingComponent

▸ **DefaultLoadingComponent**(): `Element`

*Defined in [DefaultLoadingComponent.tsx:3](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/DefaultLoadingComponent.tsx#L3)*

**Returns:** `Element`

___
<a id="configure"></a>

###  configure

▸ **configure**(config: *[IConfiguration](interfaces/iconfiguration.md)*): `void`

*Defined in [Configure.ts:15](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/Configure.ts#L15)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| config | [IConfiguration](interfaces/iconfiguration.md) |

**Returns:** `void`

___
<a id="defaultshowloadingindicator"></a>

### `<Const>` defaultShowLoadingIndicator

▸ **defaultShowLoadingIndicator**(__namedParameters: *`object`*): `boolean`

*Defined in [WithLoadingIndicator.tsx:16](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/WithLoadingIndicator.tsx#L16)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| __namedParameters | `object` |

**Returns:** `boolean`

___
<a id="getconfiguration"></a>

###  getConfiguration

▸ **getConfiguration**(): [IConfiguration](interfaces/iconfiguration.md)

*Defined in [Configure.ts:11](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/Configure.ts#L11)*

**Returns:** [IConfiguration](interfaces/iconfiguration.md)

___
<a id="usingmount"></a>

###  usingMount

▸ **usingMount**(component: * `React.ComponentType`<`any`> &#124; `Element`*, whileMounted: *`function`*, mountOptions?: *`object`*): `void`

*Defined in [TestUtils/EnzymeHelper.tsx:11](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/TestUtils/EnzymeHelper.tsx#L11)*

Helper function to handle mounting and unmounting a component using enzyme to ensure resources are cleaned up.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| component |  `React.ComponentType`<`any`> &#124; `Element`| - |  Component to mount in wrapper |
| whileMounted | `function` | - |  Function to execute while component is mounted |
| `Default value` mountOptions | `object` |  {} |  options passed into mount as second param |

**Returns:** `void`

___
<a id="withloadingindicator"></a>

###  withLoadingIndicator

▸ **withLoadingIndicator**P(test?: *[IShowLoadingIndicator](interfaces/ishowloadingindicator.md)< `P` &#124; `any`>*, loadingComponent?: *`React.ComponentType`<`any`>*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithLoadingIndicator.tsx:26](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/WithLoadingIndicator.tsx#L26)*

Displays a loading component if the given test function returns true.

The default test function returns true if a prop `isLoading` is set to true.

If no loading component is provided either statically or as a prop, it will use the loading component specified in the configuration.

**Type parameters:**

#### P 
**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` test | [IShowLoadingIndicator](interfaces/ishowloadingindicator.md)< `P` &#124; `any`> |  defaultShowLoadingIndicator |
| `Optional` loadingComponent | `React.ComponentType`<`any`> | - |

**Returns:** `ComponentEnhancer`<`P`, `P`>

___
<a id="withmodel"></a>

###  withModel

▸ **withModel**P(dataServiceName: *`string`*, idPropKey?: *`string`*, modelPropKey?: *`string`*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithModel.ts:17](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/WithModel.ts#L17)*

An HOC to inject a model into a component given the name of the DataService for that model.

Automatically updates (rerenders) the component when the observable updates and automatically unsubscribes on unmount

**Type parameters:**

#### P 
**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| dataServiceName | `string` | - |
| `Default value` idPropKey | `string` |  dataServiceName + &quot;Id&quot; |
| `Default value` modelPropKey | `string` |  dataServiceName |

**Returns:** `ComponentEnhancer`<`P`, `P`>

___
<a id="withmodelarray"></a>

###  withModelArray

▸ **withModelArray**P(dataServiceName: *`string`*, idPropKey?: *`string`*, modelPropKey?: *`string`*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithModelArray.ts:16](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/WithModelArray.ts#L16)*

An HOC to inject a model array into a component given the name of the DataService for that model and a list of ids.

Automatically updates (rerenders) the component when the observable updates and automatically unsubscribes on unmount

**Type parameters:**

#### P 
**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| dataServiceName | `string` | - |
| `Default value` idPropKey | `string` |  dataServiceName + &quot;Ids&quot; |
| `Default value` modelPropKey | `string` |  plural(dataServiceName) |

**Returns:** `ComponentEnhancer`<`P`, `P`>

___
<a id="withmodelquery"></a>

###  withModelQuery

▸ **withModelQuery**P(options?: * [IWithModelQueryOptions](interfaces/iwithmodelqueryoptions.md) & `P`*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithModelQuery.ts:31](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/WithModelQuery.ts#L31)*

An HOC to inject a model array into a component given the name of the DataService for that model and some query params which will be passed to the API to load those items.

Automatically updates (rerenders) the component when the observable updates and automatically unsubscribes on unmount

**Type parameters:**

#### P 
**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` options |  [IWithModelQueryOptions](interfaces/iwithmodelqueryoptions.md) & `P`|

**Returns:** `ComponentEnhancer`<`P`, `P`>

___
<a id="withnewmodel"></a>

###  withNewModel

▸ **withNewModel**P(dataServiceName: *`string`*, idPropKey?: *`string`*, modelPropKey?: *`string`*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithNewModel.tsx:13](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/WithNewModel.tsx#L13)*

An HOC which returns a new unsaved model if one is not provided.

**Type parameters:**

#### P 
**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| dataServiceName | `string` | - |  name of service to retrieve from service provider |
| `Default value` idPropKey | `string` |  dataServiceName + &quot;Id&quot; |  property name to find the id for the model on |
| `Default value` modelPropKey | `string` |  dataServiceName |  name of model prop name to enhance component with |

**Returns:** `ComponentEnhancer`<`P`, `P`>

___

## Object literals

<a id="configuration"></a>

### `<Let>` configuration

**configuration**: *`object`*

*Defined in [Configure.ts:7](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/Configure.ts#L7)*

<a id="configuration.loadingcomponent"></a>

####  loadingComponent

**● loadingComponent**: *[DefaultLoadingComponent]()* =  DefaultLoadingComponent

*Defined in [Configure.ts:8](https://github.com/Rediker-Software/redux-data-service-react/blob/431cbf8/src/Configure.ts#L8)*

___

___

