[redux-data-service-react](../README.md) > [FakeComponent](../classes/fakecomponent.md)

# Class: FakeComponent

## Type parameters
#### S 
#### SS 
#### S 
## Hierarchy

 `Component`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)>

**↳ FakeComponent**

## Index

### Constructors

* [constructor](fakecomponent.md#constructor)

### Properties

* [context](fakecomponent.md#context)
* [props](fakecomponent.md#props)
* [refs](fakecomponent.md#refs)
* [state](fakecomponent.md#state)
* [contextType](fakecomponent.md#contexttype)

### Methods

* [UNSAFE_componentWillMount](fakecomponent.md#unsafe_componentwillmount)
* [UNSAFE_componentWillReceiveProps](fakecomponent.md#unsafe_componentwillreceiveprops)
* [UNSAFE_componentWillUpdate](fakecomponent.md#unsafe_componentwillupdate)
* [componentDidCatch](fakecomponent.md#componentdidcatch)
* [componentDidMount](fakecomponent.md#componentdidmount)
* [componentDidUpdate](fakecomponent.md#componentdidupdate)
* [componentWillMount](fakecomponent.md#componentwillmount)
* [componentWillReceiveProps](fakecomponent.md#componentwillreceiveprops)
* [componentWillUnmount](fakecomponent.md#componentwillunmount)
* [componentWillUpdate](fakecomponent.md#componentwillupdate)
* [forceUpdate](fakecomponent.md#forceupdate)
* [getSnapshotBeforeUpdate](fakecomponent.md#getsnapshotbeforeupdate)
* [render](fakecomponent.md#render)
* [setState](fakecomponent.md#setstate)
* [shouldComponentUpdate](fakecomponent.md#shouldcomponentupdate)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FakeComponent**(props: *`Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)>*): [FakeComponent](fakecomponent.md)

⊕ **new FakeComponent**(props: *[IFakeComponentProps](../interfaces/ifakecomponentprops.md)*, context?: *`any`*): [FakeComponent](fakecomponent.md)

*Inherited from Component.__constructor*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:435*

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | `Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)> |

**Returns:** [FakeComponent](fakecomponent.md)

*Inherited from Component.__constructor*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:437*

*__deprecated__*: 

*__see__*: [https://reactjs.org/docs/legacy-context.html](https://reactjs.org/docs/legacy-context.html)

**Parameters:**

| Name | Type |
| ------ | ------ |
| props | [IFakeComponentProps](../interfaces/ifakecomponentprops.md) |
| `Optional` context | `any` |

**Returns:** [FakeComponent](fakecomponent.md)

___

## Properties

<a id="context"></a>

###  context

**● context**: *`any`*

*Inherited from Component.context*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:435*

If using the new style context, re-declare this in your class to be the `React.ContextType` of your `static contextType`.

```ts
static contextType = MyContext
context!: React.ContextType<typeof MyContext>
```

*__deprecated__*: if used without a type annotation, or without static contextType

*__see__*: [https://reactjs.org/docs/legacy-context.html](https://reactjs.org/docs/legacy-context.html)

___
<a id="props"></a>

###  props

**● props**: *`Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)> & `Readonly`<`object`>*

*Inherited from Component.props*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:460*

___
<a id="refs"></a>

###  refs

**● refs**: *`object`*

*Inherited from Component.refs*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:466*

*__deprecated__*: [https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)

#### Type declaration

[key: `string`]: `ReactInstance`

___
<a id="state"></a>

###  state

**● state**: *`Readonly`<`S`>*

*Inherited from Component.state*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:461*

___
<a id="contexttype"></a>

### `<Static>``<Optional>` contextType

**● contextType**: *`Context`<`any`>*

*Inherited from Component.contextType*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:420*

If set, `this.context` will be set at runtime to the current value of the given Context.

Usage:

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render () {
    return <>My context's value: {this.context}</>;
  }
}
```

*__see__*: [https://reactjs.org/docs/context.html#classcontexttype](https://reactjs.org/docs/context.html#classcontexttype)

___

## Methods

<a id="unsafe_componentwillmount"></a>

### `<Optional>` UNSAFE_componentWillMount

▸ **UNSAFE_componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillMount*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:648*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="unsafe_componentwillreceiveprops"></a>

### `<Optional>` UNSAFE_componentWillReceiveProps

▸ **UNSAFE_componentWillReceiveProps**(nextProps: *`Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillReceiveProps*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:680*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="unsafe_componentwillupdate"></a>

### `<Optional>` UNSAFE_componentWillUpdate

▸ **UNSAFE_componentWillUpdate**(nextProps: *`Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)>*, nextState: *`Readonly`<`S`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.UNSAFE_componentWillUpdate*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:708*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)> |
| nextState | `Readonly`<`S`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentdidcatch"></a>

### `<Optional>` componentDidCatch

▸ **componentDidCatch**(error: *`Error`*, errorInfo: *`ErrorInfo`*): `void`

*Inherited from ComponentLifecycle.componentDidCatch*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:577*

Catches exceptions generated in descendant components. Unhandled exceptions will cause the entire component tree to unmount.

**Parameters:**

| Name | Type |
| ------ | ------ |
| error | `Error` |
| errorInfo | `ErrorInfo` |

**Returns:** `void`

___
<a id="componentdidmount"></a>

### `<Optional>` componentDidMount

▸ **componentDidMount**(): `void`

*Inherited from ComponentLifecycle.componentDidMount*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:556*

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

**Returns:** `void`

___
<a id="componentdidupdate"></a>

### `<Optional>` componentDidUpdate

▸ **componentDidUpdate**(prevProps: *`Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)>*, prevState: *`Readonly`<`S`>*, snapshot?: *`SS`*): `void`

*Inherited from NewLifecycle.componentDidUpdate*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:619*

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)> |
| prevState | `Readonly`<`S`> |
| `Optional` snapshot | `SS` |

**Returns:** `void`

___
<a id="componentwillmount"></a>

### `<Optional>` componentWillMount

▸ **componentWillMount**(): `void`

*Inherited from DeprecatedLifecycle.componentWillMount*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:634*

Called immediately before mounting occurs, and before `Component#render`. Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use componentDidMount or the constructor instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Returns:** `void`

___
<a id="componentwillreceiveprops"></a>

### `<Optional>` componentWillReceiveProps

▸ **componentWillReceiveProps**(nextProps: *`Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillReceiveProps*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:663*

Called when the component may be receiving new props. React may call this even if props have not changed, so be sure to compare new and existing props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="componentwillunmount"></a>

### `<Optional>` componentWillUnmount

▸ **componentWillUnmount**(): `void`

*Inherited from ComponentLifecycle.componentWillUnmount*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:572*

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

**Returns:** `void`

___
<a id="componentwillupdate"></a>

### `<Optional>` componentWillUpdate

▸ **componentWillUpdate**(nextProps: *`Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)>*, nextState: *`Readonly`<`S`>*, nextContext: *`any`*): `void`

*Inherited from DeprecatedLifecycle.componentWillUpdate*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:693*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps prevents this from being invoked.

*__deprecated__*: 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)

*__see__*: [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)> |
| nextState | `Readonly`<`S`> |
| nextContext | `any` |

**Returns:** `void`

___
<a id="forceupdate"></a>

###  forceUpdate

▸ **forceUpdate**(callBack?: *`function`*): `void`

*Inherited from Component.forceUpdate*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:452*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` callBack | `function` |

**Returns:** `void`

___
<a id="getsnapshotbeforeupdate"></a>

### `<Optional>` getSnapshotBeforeUpdate

▸ **getSnapshotBeforeUpdate**(prevProps: *`Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)>*, prevState: *`Readonly`<`S`>*): `SS` \| `null`

*Inherited from NewLifecycle.getSnapshotBeforeUpdate*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:613*

Runs before React applies the result of `render` to the document, and returns an object to be given to componentDidUpdate. Useful for saving things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated lifecycle events from running.

**Parameters:**

| Name | Type |
| ------ | ------ |
| prevProps | `Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)> |
| prevState | `Readonly`<`S`> |

**Returns:** `SS` \| `null`

___
<a id="render"></a>

###  render

▸ **render**(): `Element`

*Overrides Component.render*

*Defined in [TestUtils/FakeComponent.tsx:8](https://github.com/Rediker-Software/redux-data-service-react/blob/771395e/src/TestUtils/FakeComponent.tsx#L8)*

**Returns:** `Element`

___
<a id="setstate"></a>

###  setState

▸ **setState**<`K`>(state: *`function` \| `S` \| `object`*, callback?: *`function`*): `void`

*Inherited from Component.setState*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:447*

**Type parameters:**

#### K :  `keyof S`
**Parameters:**

| Name | Type |
| ------ | ------ |
| state | `function` \| `S` \| `object` |
| `Optional` callback | `function` |

**Returns:** `void`

___
<a id="shouldcomponentupdate"></a>

### `<Optional>` shouldComponentUpdate

▸ **shouldComponentUpdate**(nextProps: *`Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)>*, nextState: *`Readonly`<`S`>*, nextContext: *`any`*): `boolean`

*Inherited from ComponentLifecycle.shouldComponentUpdate*

*Defined in /Users/jmadson/projects/redux-data-service-react/node_modules/@types/react/index.d.ts:567*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true. `PureComponent` implements a shallow comparison on props and state and returns true if any props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate` and `componentDidUpdate` will not be called.

**Parameters:**

| Name | Type |
| ------ | ------ |
| nextProps | `Readonly`<[IFakeComponentProps](../interfaces/ifakecomponentprops.md)> |
| nextState | `Readonly`<`S`> |
| nextContext | `any` |

**Returns:** `boolean`

___

