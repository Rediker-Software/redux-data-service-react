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

* [estimatedPageHeight](iinfinitescrollinternalprops.md#estimatedpageheight)
* [handleScrollDebounced](iinfinitescrollinternalprops.md#handlescrolldebounced)
* [handleScrollPersistingEvent](iinfinitescrollinternalprops.md#handlescrollpersistingevent)
* [handleScrollThrottled](iinfinitescrollinternalprops.md#handlescrollthrottled)
* [lastScrollTop](iinfinitescrollinternalprops.md#lastscrolltop)
* [nextPageHeightRef](iinfinitescrollinternalprops.md#nextpageheightref)
* [nextPlaceHolderHeight](iinfinitescrollinternalprops.md#nextplaceholderheight)
* [pageHeightMap](iinfinitescrollinternalprops.md#pageheightmap)
* [previousPlaceHolderHeight](iinfinitescrollinternalprops.md#previousplaceholderheight)
* [query](iinfinitescrollinternalprops.md#query)
* [updatePageHeightMap](iinfinitescrollinternalprops.md#updatepageheightmap)
* [updateQuery](iinfinitescrollinternalprops.md#updatequery)

---

## Properties

<a id="estimatedpageheight"></a>

###  estimatedPageHeight

**● estimatedPageHeight**: *`number`*

*Inherited from [IInfiniteScrollHeightMapProps](iinfinitescrollheightmapprops.md).[estimatedPageHeight](iinfinitescrollheightmapprops.md#estimatedpageheight)*

*Defined in [Components/InfiniteScroll.tsx:41](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L41)*

___
<a id="handlescrolldebounced"></a>

###  handleScrollDebounced

**● handleScrollDebounced**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:50](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L50)*

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

*Defined in [Components/InfiniteScroll.tsx:52](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L52)*

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

*Defined in [Components/InfiniteScroll.tsx:51](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L51)*

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

*Defined in [Components/InfiniteScroll.tsx:48](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L48)*

___
<a id="nextpageheightref"></a>

###  nextPageHeightRef

**● nextPageHeightRef**: *`RefObject`<`any`>*

*Defined in [Components/InfiniteScroll.tsx:49](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L49)*

___
<a id="nextplaceholderheight"></a>

###  nextPlaceHolderHeight

**● nextPlaceHolderHeight**: *`number`*

*Defined in [Components/InfiniteScroll.tsx:54](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L54)*

___
<a id="pageheightmap"></a>

###  pageHeightMap

**● pageHeightMap**: *`object`*

*Inherited from [IInfiniteScrollHeightMapProps](iinfinitescrollheightmapprops.md).[pageHeightMap](iinfinitescrollheightmapprops.md#pageheightmap)*

*Defined in [Components/InfiniteScroll.tsx:40](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L40)*

#### Type declaration

[key: `string`]: `number`

___
<a id="previousplaceholderheight"></a>

###  previousPlaceHolderHeight

**● previousPlaceHolderHeight**: *`number`*

*Defined in [Components/InfiniteScroll.tsx:53](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L53)*

___
<a id="query"></a>

###  query

**● query**: *`IQueryManager`<`T`>*

*Defined in [Components/InfiniteScroll.tsx:45](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L45)*

___
<a id="updatepageheightmap"></a>

###  updatePageHeightMap

**● updatePageHeightMap**: *`function`*

*Defined in [Components/InfiniteScroll.tsx:46](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L46)*

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

*Defined in [Components/InfiniteScroll.tsx:47](https://github.com/Rediker-Software/redux-data-service-react/blob/bc21036/src/Components/InfiniteScroll.tsx#L47)*

#### Type declaration
▸(queryBuilder: *`IQueryBuilder`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| queryBuilder | `IQueryBuilder` |

**Returns:** `void`

___

