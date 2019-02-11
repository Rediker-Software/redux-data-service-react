[redux-data-service-react](../README.md) > [IInfiniteScrollInternalProps](../interfaces/iinfinitescrollinternalprops.md)

# Interface: IInfiniteScrollInternalProps

## Type parameters
#### T :  `IModel`<`IModelData`>
## Hierarchy

 `object`

 [IInfiniteScrollHeightMapProps](iinfinitescrollheightmapprops.md)

**↳ IInfiniteScrollInternalProps**

## Index

### Properties

* [currentPageHeightRef](iinfinitescrollinternalprops.md#currentpageheightref)
* [estimatedPageHeight](iinfinitescrollinternalprops.md#estimatedpageheight)
* [handleScrollDebounced](iinfinitescrollinternalprops.md#handlescrolldebounced)
* [handleScrollPersistingEvent](iinfinitescrollinternalprops.md#handlescrollpersistingevent)
* [handleScrollThrottled](iinfinitescrollinternalprops.md#handlescrollthrottled)
* [lastScrollTop](iinfinitescrollinternalprops.md#lastscrolltop)
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

<a id="currentpageheightref"></a>

###  currentPageHeightRef

**● currentPageHeightRef**: *`RefObject`<`any`>*

*Defined in [Components/InfiniteScroll.tsx:36](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L36)*

___
<a id="estimatedpageheight"></a>

###  estimatedPageHeight

**● estimatedPageHeight**: *`number`*

*Inherited from [IInfiniteScrollHeightMapProps](iinfinitescrollheightmapprops.md).[estimatedPageHeight](iinfinitescrollheightmapprops.md#estimatedpageheight)*

*Defined in [Components/InfiniteScroll.tsx:28](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L28)*

___
<a id="handlescrolldebounced"></a>

###  handleScrollDebounced

**● handleScrollDebounced**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:39](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L39)*

#### Type declaration
▸(e: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `any` |

**Returns:** `void`

___
<a id="handlescrollpersistingevent"></a>

###  handleScrollPersistingEvent

**● handleScrollPersistingEvent**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:41](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L41)*

#### Type declaration
▸(e: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `any` |

**Returns:** `void`

___
<a id="handlescrollthrottled"></a>

###  handleScrollThrottled

**● handleScrollThrottled**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:40](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L40)*

#### Type declaration
▸(e: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| e | `any` |

**Returns:** `void`

___
<a id="lastscrolltop"></a>

###  lastScrollTop

**● lastScrollTop**: *`number`*

*Defined in [Components/InfiniteScroll.tsx:35](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L35)*

___
<a id="nextpageheightref"></a>

###  nextPageHeightRef

**● nextPageHeightRef**: *`RefObject`<`any`>*

*Defined in [Components/InfiniteScroll.tsx:38](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L38)*

___
<a id="nextplaceholderheight"></a>

###  nextPlaceHolderHeight

**● nextPlaceHolderHeight**: *`number`*

*Defined in [Components/InfiniteScroll.tsx:43](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L43)*

___
<a id="pageheightmap"></a>

###  pageHeightMap

**● pageHeightMap**: *`object`*

*Inherited from [IInfiniteScrollHeightMapProps](iinfinitescrollheightmapprops.md).[pageHeightMap](iinfinitescrollheightmapprops.md#pageheightmap)*

*Defined in [Components/InfiniteScroll.tsx:27](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L27)*

#### Type declaration

[key: `string`]: `number`

___
<a id="previouspageheightref"></a>

###  previousPageHeightRef

**● previousPageHeightRef**: *`RefObject`<`any`>*

*Defined in [Components/InfiniteScroll.tsx:37](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L37)*

___
<a id="previousplaceholderheight"></a>

###  previousPlaceHolderHeight

**● previousPlaceHolderHeight**: *`number`*

*Defined in [Components/InfiniteScroll.tsx:42](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L42)*

___
<a id="query"></a>

###  query

**● query**: *`IQueryManager`<`T`>*

*Defined in [Components/InfiniteScroll.tsx:32](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L32)*

___
<a id="updatepageheightmap"></a>

###  updatePageHeightMap

**● updatePageHeightMap**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:33](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L33)*

#### Type declaration
▸(query: *`IQueryManager`<`any`>*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| query | `IQueryManager`<`any`> |

**Returns:** `any`

___
<a id="updatequery"></a>

###  updateQuery

**● updateQuery**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:34](https://github.com/Rediker-Software/redux-data-service-react/blob/36ecfc2/src/Components/InfiniteScroll.tsx#L34)*

#### Type declaration
▸(queryBuilder: *`IQueryBuilder`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| queryBuilder | `IQueryBuilder` |

**Returns:** `void`

___

