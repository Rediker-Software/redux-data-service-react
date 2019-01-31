[redux-data-service-react](../README.md) > [IInfiniteScrollInternalProps](../interfaces/iinfinitescrollinternalprops.md)

# Interface: IInfiniteScrollInternalProps

## Type parameters
#### T :  `IModel`<`IModelData`>
## Hierarchy

 [IInfiniteScrollProps](iinfinitescrollprops.md)<[IInfiniteScrollProps](iinfinitescrollprops.md)<`any`>, "query">

 [IInfiniteScrollHeightMapProps](iinfinitescrollheightmapprops.md)

**↳ IInfiniteScrollInternalProps**

## Indexable

\[key: `string`\]:&nbsp;`any`
## Index

### Properties

* [containerComponent](iinfinitescrollinternalprops.md#containercomponent)
* [contentPlaceHolderComponent](iinfinitescrollinternalprops.md#contentplaceholdercomponent)
* [currentPageHeightRef](iinfinitescrollinternalprops.md#currentpageheightref)
* [debounceTime](iinfinitescrollinternalprops.md#debouncetime)
* [disableVirtualScrolling](iinfinitescrollinternalprops.md#disablevirtualscrolling)
* [estimatedPageHeight](iinfinitescrollinternalprops.md#estimatedpageheight)
* [handleScrollDebounced](iinfinitescrollinternalprops.md#handlescrolldebounced)
* [handleScrollPersistingEvent](iinfinitescrollinternalprops.md#handlescrollpersistingevent)
* [handleScrollThrottled](iinfinitescrollinternalprops.md#handlescrollthrottled)
* [lastScrollTop](iinfinitescrollinternalprops.md#lastscrolltop)
* [modelComponent](iinfinitescrollinternalprops.md#modelcomponent)
* [modelComponentProps](iinfinitescrollinternalprops.md#modelcomponentprops)
* [modelName](iinfinitescrollinternalprops.md#modelname)
* [nextPageHeightRef](iinfinitescrollinternalprops.md#nextpageheightref)
* [nextPlaceHolderHeight](iinfinitescrollinternalprops.md#nextplaceholderheight)
* [pageHeightMap](iinfinitescrollinternalprops.md#pageheightmap)
* [previousPageHeightRef](iinfinitescrollinternalprops.md#previouspageheightref)
* [previousPlaceHolderHeight](iinfinitescrollinternalprops.md#previousplaceholderheight)
* [query](iinfinitescrollinternalprops.md#query)
* [updatePageHeightMap](iinfinitescrollinternalprops.md#updatepageheightmap)
* [updateQuery](iinfinitescrollinternalprops.md#updatequery)

---

## Properties

<a id="containercomponent"></a>

###  containerComponent

**● containerComponent**: *`React.ComponentType`< `object` & `any`>*

*Inherited from [IInfiniteScrollProps](iinfinitescrollprops.md).[containerComponent](iinfinitescrollprops.md#containercomponent)*

*Defined in [Components/InfiniteScroll.tsx:15](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L15)*

___
<a id="contentplaceholdercomponent"></a>

### `<Optional>` contentPlaceHolderComponent

**● contentPlaceHolderComponent**: *`React.ComponentType`<`object`>*

*Inherited from [IInfiniteScrollProps](iinfinitescrollprops.md).[contentPlaceHolderComponent](iinfinitescrollprops.md#contentplaceholdercomponent)*

*Defined in [Components/InfiniteScroll.tsx:20](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L20)*

___
<a id="currentpageheightref"></a>

###  currentPageHeightRef

**● currentPageHeightRef**: *`RefObject`<`any`>*

*Defined in [Components/InfiniteScroll.tsx:36](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L36)*

___
<a id="debouncetime"></a>

### `<Optional>` debounceTime

**● debounceTime**: *`number`*

*Inherited from [IInfiniteScrollProps](iinfinitescrollprops.md).[debounceTime](iinfinitescrollprops.md#debouncetime)*

*Defined in [Components/InfiniteScroll.tsx:18](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L18)*

___
<a id="disablevirtualscrolling"></a>

### `<Optional>` disableVirtualScrolling

**● disableVirtualScrolling**: *`boolean`*

*Inherited from [IInfiniteScrollProps](iinfinitescrollprops.md).[disableVirtualScrolling](iinfinitescrollprops.md#disablevirtualscrolling)*

*Defined in [Components/InfiniteScroll.tsx:19](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L19)*

___
<a id="estimatedpageheight"></a>

###  estimatedPageHeight

**● estimatedPageHeight**: *`number`*

*Inherited from [IInfiniteScrollHeightMapProps](iinfinitescrollheightmapprops.md).[estimatedPageHeight](iinfinitescrollheightmapprops.md#estimatedpageheight)*

*Defined in [Components/InfiniteScroll.tsx:28](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L28)*

___
<a id="handlescrolldebounced"></a>

###  handleScrollDebounced

**● handleScrollDebounced**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:39](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L39)*

#### Type declaration
▸(e: *`any`*): `void`

**Parameters:**

| Param | Type |
| ------ | ------ |
| e | `any` |

**Returns:** `void`

___
<a id="handlescrollpersistingevent"></a>

###  handleScrollPersistingEvent

**● handleScrollPersistingEvent**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:41](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L41)*

#### Type declaration
▸(e: *`any`*): `void`

**Parameters:**

| Param | Type |
| ------ | ------ |
| e | `any` |

**Returns:** `void`

___
<a id="handlescrollthrottled"></a>

###  handleScrollThrottled

**● handleScrollThrottled**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:40](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L40)*

#### Type declaration
▸(e: *`any`*): `void`

**Parameters:**

| Param | Type |
| ------ | ------ |
| e | `any` |

**Returns:** `void`

___
<a id="lastscrolltop"></a>

###  lastScrollTop

**● lastScrollTop**: *`number`*

*Defined in [Components/InfiniteScroll.tsx:35](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L35)*

___
<a id="modelcomponent"></a>

###  modelComponent

**● modelComponent**: *`React.ComponentType`< `object` & `any`>*

*Inherited from [IInfiniteScrollProps](iinfinitescrollprops.md).[modelComponent](iinfinitescrollprops.md#modelcomponent)*

*Defined in [Components/InfiniteScroll.tsx:16](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L16)*

___
<a id="modelcomponentprops"></a>

### `<Optional>` modelComponentProps

**● modelComponentProps**: *`any`*

*Inherited from [IInfiniteScrollProps](iinfinitescrollprops.md).[modelComponentProps](iinfinitescrollprops.md#modelcomponentprops)*

*Defined in [Components/InfiniteScroll.tsx:17](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L17)*

___
<a id="modelname"></a>

###  modelName

**● modelName**: *`string`*

*Inherited from [IInfiniteScrollProps](iinfinitescrollprops.md).[modelName](iinfinitescrollprops.md#modelname)*

*Defined in [Components/InfiniteScroll.tsx:13](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L13)*

___
<a id="nextpageheightref"></a>

###  nextPageHeightRef

**● nextPageHeightRef**: *`RefObject`<`any`>*

*Defined in [Components/InfiniteScroll.tsx:38](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L38)*

___
<a id="nextplaceholderheight"></a>

###  nextPlaceHolderHeight

**● nextPlaceHolderHeight**: *`number`*

*Defined in [Components/InfiniteScroll.tsx:43](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L43)*

___
<a id="pageheightmap"></a>

###  pageHeightMap

**● pageHeightMap**: *`object`*

*Inherited from [IInfiniteScrollHeightMapProps](iinfinitescrollheightmapprops.md).[pageHeightMap](iinfinitescrollheightmapprops.md#pageheightmap)*

*Defined in [Components/InfiniteScroll.tsx:27](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L27)*

#### Type declaration

[key: `string`]: `number`

___
<a id="previouspageheightref"></a>

###  previousPageHeightRef

**● previousPageHeightRef**: *`RefObject`<`any`>*

*Defined in [Components/InfiniteScroll.tsx:37](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L37)*

___
<a id="previousplaceholderheight"></a>

###  previousPlaceHolderHeight

**● previousPlaceHolderHeight**: *`number`*

*Defined in [Components/InfiniteScroll.tsx:42](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L42)*

___
<a id="query"></a>

###  query

**● query**: *`IQueryManager`<`T`>*

*Overrides [IInfiniteScrollProps](iinfinitescrollprops.md).[query](iinfinitescrollprops.md#query)*

*Defined in [Components/InfiniteScroll.tsx:32](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L32)*

___
<a id="updatepageheightmap"></a>

###  updatePageHeightMap

**● updatePageHeightMap**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:33](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L33)*

#### Type declaration
▸(query: *`IQueryManager`<`any`>*): `any`

**Parameters:**

| Param | Type |
| ------ | ------ |
| query | `IQueryManager`<`any`> |

**Returns:** `any`

___
<a id="updatequery"></a>

###  updateQuery

**● updateQuery**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:34](https://github.com/Rediker-Software/redux-data-service-react/blob/e0c5bcc/src/Components/InfiniteScroll.tsx#L34)*

#### Type declaration
▸(queryBuilder: *`IQueryBuilder`*): `void`

**Parameters:**

| Param | Type |
| ------ | ------ |
| queryBuilder | `IQueryBuilder` |

**Returns:** `void`

___

