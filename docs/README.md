
redux-data-service-react
========================

[![CircleCI](https://circleci.com/gh/Rediker-Software/redux-data-service-react.svg?style=svg)](https://circleci.com/gh/Rediker-Software/redux-data-service-react)

A set of React components and HOCs to easily connect your React project to [redux-data-service](https://github.com/Rediker-Software/redux-data-service).

*   Create Model classes with [redux-data-service](https://github.com/Rediker-Software/redux-data-service)
    *   Add custom validation logic to each Model
    *   Support custom serializers and API adapters to connect to any API
    *   Interact with your Models using a friendly, orm-like, syntax
*   Use [redux-data-service-react](https://github.com/Rediker-Software/redux-data-service-react) with your React project to:
    *   Automatically load and subscribe to model(s) when your component mounts
    *   Query your API with a configurable set of query params passed as props to your component

Your components will receive the latest copy of the model(s) as props, which will refresh whenever the model(s) are updated.

Create models with `TypeScript` classes:
----------------------------------------

```typescript
// student/model.ts
import { attr, required, Model, EmailField, NumberField, StringField } from "redux-data-service";

export class Student extends Model {
  public readonly string serviceName = "student";

  @required()
  @attr(StringField)
  public string firstName;

  @attr(NumberField)
  public string age;

  @attr(EmailField)
  public string email;
}
```

> See the docs in [redux-data-service](https://github.com/Rediker-Software/redux-data-service) for more information about configuring your Model classes, connecting to Redux and seamlessly querying your API.

`withModel(modelName: string)`
------------------------------

A higher-order component which will automatically request and subscribe to a given Model when the component mounts.

*   Pass the model's id or an instance of the model as a prop to the component
*   If the requested model is not in the Redux store, it will go through the model's API adapter to load the model from the API.
*   The wrapped component will be given a new instance of the model every time it is updated.

### Example

```typescript
// student/StudentDetail.tsx

import * as React from "react";
import { withModel } from "redux-data-service-react";

export const StudentDetail = withModel("student")(({ student }) => (
  <section>
    <h1>{student.firstName}</h1>
    <p>Age: {student.age}</p>
    <p>Email: {student.email}</p>
  </section>
));
```

To specify the ID of the model to load, add "Id" to the end of the `modelName` param that was given to `withModel`. For example, provide the `studentId` prop and it will request and subscribe to the `student` model:

```typescript
<StudentDetail studentId="123"/>
```

You can also provide a `student` instance as a prop to subscribe to it

```typescript
<StudentDetail student={myStudent}/>
```

> Note the naming conventions employed by `withModel` above:
> 
> *   `studentId` is used as the prop to specify the id for the `student` model
> *   `student` is used as the prop to specify the model instance for the `student` model

#### Working with [React-Router](https://reacttraining.com/react-router/)

Pass the id from the route into the above component, for example:

```
<Route
  path="/students/:studentId"
  render={(props) => <StudentDetail studentId={props.match.params.studentId}/>}
/>
```

`withNewModel(modelName: string)`
---------------------------------

A higher-order component which will create and subscribe to a new instance of the given Model when the component mounts.

*   If an ID or model instance are provided as props, the HOC will request and subscribe to it instead of creating a new instance
*   This means the component can be used for creating a new model or editing an existing one

### Example

```typescript
// student/StudentForm.tsx

import * as React from "react";
import { withNewModel } from "redux-data-service-react";

// provided for example purposes
const Input = ({ model, name, ...inputProps }) => <input value={model[name]} onChange={event => model[name] = event.target.value} {...inputProps} />;
const Form = ({ model, children }) => <form onSubmit={model.save}>{children}</form>;

export const StudentForm = withNewModel("student")(({ student }) => (
  <Form model={student}>
    <Input model={student} name="firstName" />
    <Input model={student} name="age" type="number" />
    <Input model={student} name="email" type="email" />
    <button type="submit" value="Save" />
  </Form>
);
```

When the component is mounted, it will be given a new instance of the model:

```typescript
<StudentForm />
```

> If the model is using the default API adapter, saving the form will send a `POST` to the model's corresponding REST endpoint

To edit an existing model, provide the model instance or an id:

```typescript
<StudentForm studentId="123" />
```

> The requested model will be loaded from the API and the form will be populated. If the model is using the default API adapter, saving the form will send a `PUT` to the model's corresponding REST endpoint

Note that although in this example it appears that the model is mutable, `redux-data-service` is actually dispatching a Redux action whenever a value is set on one of the model's properties. The model instance is replaced with a new instance with that change and React will re-render as expected.

When the model has unsaved changes, it will be considered "dirty" such that `model.isDirty == true`. Use `model.reset()` to revert the model to its original state, or `model.save()` to commit the pending changes to the API.

`withModelArray(modelName: string)`
-----------------------------------

A higher-order component which will automatically request and subscribe to a given array of Models when the component mounts.

*   Pass the model ids or an array of models as a prop to the component
*   If the requested models are not in the Redux store, `redux-data-service` will go through the model's API adapter to load them from the API.
*   The wrapped component will be given a new array of the models every time one of them is updated.

### Example

```typescript
// student/StudentGroup.tsx

import * as React from "react";
import { withModel } from "redux-data-service-react";

export const StudentGroup = withModelArray("student")(({ students }) => (
  {students.map(student =>
  <ul> 
    <li>{student.firstName}</li>
  </ul>
  }
));
```

To specify the IDs of the models to load, add "Ids" to the end of the `modelName` param that was given to `withModelArray`. For example, provide the `studentIds` prop and it will request and subscribe to those IDs for the `student` model:

```typescript
<StudentDetail studentIds={["123", "456", "789"]}/>
```

You can also provide a `students` prop which will fall through to the wrapped component:

```typescript
<StudentGroup students={myStudents}/>
```

> Note the naming conventions employed by `withModelArray` above:
> 
> *   `studentIds` is used as the prop to specify the ids for the `student` model
> *   `students` is used as the prop to specify the model instances for the `student` model

`withModelQuery(options)`
-------------------------

A higher-order component which will automatically query the API and subscribe to the models it returns when the component mounts.

The `options` object will be set as default props. They may also be overridden and passed as regular props to the component.

*   `modelName` (required) The name of the model to query
*   `query` (optional) The default query params to use when making a request to the API. If this field is omitted, the `getDefaultQueryParams()` method on the model's data service is used
*   `items` (optional) The array of model instances which will be passed through to the wrapped component. If this prop is provided, the API is not queried.
*   `loadingComponent` (optional) the component to display when the API query is executing. By default, this will display the loading component specified in the configuration, or "Loading..." if one was not provided.
*   `loadingComponentProps` (optional) extra props to pass through to the loading component

### Example

```typescript
// student/StudentList.tsx

import * as React from "react";
import { withModel } from "redux-data-service-react";

export const StudentList = withModelQuery({ modelName: "student" })(({ items }) => (
  {items.map(student =>
  <ul> 
    <li>{student.firstName}</li>
  </ul>
  }
));
```

Using it with no query params:

```typescript
<StudentList/>
```

> If the model is using the default API adapter, this will send a GET request to: `/api/student`

Using the `query` prop to specify query params:

```typescript
<StudentList query={{page: 1}}/>
```

> If the model is using the default API adapter, this will send a GET request to: `/api/student?page=1`

If you provide the `items` prop, they will pass through to the wrapped component and no API request will be sent:

```typescript
<StudentList items={students}/>
```

Testing
-------

To test components decorated with the HOCs provided by this library:

1.  Register each Model/DataService pair using the the `initializeTestServices` function provided by `redux-data-service`.
2.  Use `seedService` or `seedServiceList` from `redux-data-service` to pre-populate Redux with mock data.
    *   Note: the seed functions require a `createMock<ModelName>` function which returns a mock instance of the given model to be registered with `initializeTestServices`.
    *   For example, use `createMockStudent` to seed the `student` model.
3.  You may optionally use the `usingMount` Enzyme helper provided by `redux-data-service-react`, which will:
    *   mount your component
    *   fire a callback with the mounted component's wrapper
    *   then cleanly tear down your component.

### Example

```typescript
import { initializeTestServices, seedService } from `redux-data-service`;
import { usingMount } from `redux-data-service`;

import { Student, StudentService, createMockStudent, StudentDetail } from "./student";

// also import dependencies needed depending on your test runner...

describe("Student", () => {
  let student;

  beforeEach(() => {
    initalizeTestServices({ student: { Student, StudentService, createMockStudent } });
    student = seedService("student");
  });

  it("displays the student's firstName", () => {
    usingMount(
      <StudentDetail student={student}/>,
      (wrapper) => expect(wrapper.find("h1").text()).to.equal(student.firstName)
    );
  });
});
```

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

*Defined in [Query.tsx:12](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/Query.tsx#L12)*

___

## Functions

<a id="defaultloadingcomponent"></a>

### `<Const>` DefaultLoadingComponent

▸ **DefaultLoadingComponent**(): `Element`

*Defined in [DefaultLoadingComponent.tsx:3](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/DefaultLoadingComponent.tsx#L3)*

**Returns:** `Element`

___
<a id="configure"></a>

###  configure

▸ **configure**(config: *[IConfiguration](interfaces/iconfiguration.md)*): `void`

*Defined in [Configure.ts:15](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/Configure.ts#L15)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| config | [IConfiguration](interfaces/iconfiguration.md) |

**Returns:** `void`

___
<a id="defaultshowloadingindicator"></a>

### `<Const>` defaultShowLoadingIndicator

▸ **defaultShowLoadingIndicator**(__namedParameters: *`object`*): `boolean`

*Defined in [WithLoadingIndicator.tsx:16](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/WithLoadingIndicator.tsx#L16)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| __namedParameters | `object` |

**Returns:** `boolean`

___
<a id="getconfiguration"></a>

###  getConfiguration

▸ **getConfiguration**(): [IConfiguration](interfaces/iconfiguration.md)

*Defined in [Configure.ts:11](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/Configure.ts#L11)*

**Returns:** [IConfiguration](interfaces/iconfiguration.md)

___
<a id="usingmount"></a>

###  usingMount

▸ **usingMount**(component: * `React.ComponentType`<`any`> &#124; `Element`*, whileMounted: *`function`*, mountOptions?: *`object`*):  `Promise`<`any`> &#124; `void`

*Defined in [TestUtils/EnzymeHelper.tsx:11](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/TestUtils/EnzymeHelper.tsx#L11)*

Helper function to handle mounting and unmounting a component using enzyme to ensure resources are cleaned up.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| component |  `React.ComponentType`<`any`> &#124; `Element`| - |  Component to mount in wrapper |
| whileMounted | `function` | - |  Function to execute while component is mounted |
| `Default value` mountOptions | `object` |  {} |  options passed into mount as second param |

**Returns:**  `Promise`<`any`> &#124; `void`

___
<a id="withloadingindicator"></a>

###  withLoadingIndicator

▸ **withLoadingIndicator**P(test?: *[IShowLoadingIndicator](interfaces/ishowloadingindicator.md)< `P` &#124; `any`>*, loadingComponent?: *`React.ComponentType`<`any`>*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithLoadingIndicator.tsx:26](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/WithLoadingIndicator.tsx#L26)*

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

*Defined in [WithModel.ts:17](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/WithModel.ts#L17)*

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

*Defined in [WithModelArray.ts:16](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/WithModelArray.ts#L16)*

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

*Defined in [WithModelQuery.ts:31](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/WithModelQuery.ts#L31)*

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

*Defined in [WithNewModel.tsx:13](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/WithNewModel.tsx#L13)*

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

*Defined in [Configure.ts:7](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/Configure.ts#L7)*

<a id="configuration.loadingcomponent"></a>

####  loadingComponent

**● loadingComponent**: *[DefaultLoadingComponent]()* =  DefaultLoadingComponent

*Defined in [Configure.ts:8](https://github.com/Rediker-Software/redux-data-service-react/blob/2c860bf/src/Configure.ts#L8)*

___

___

