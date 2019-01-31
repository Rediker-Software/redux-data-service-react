
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
* [IContentPlaceHolderProps](interfaces/icontentplaceholderprops.md)
* [IDisplayPreviousPageProps](interfaces/idisplaypreviouspageprops.md)
* [IFakeComponentProps](interfaces/ifakecomponentprops.md)
* [IInfiniteScrollHeightMapProps](interfaces/iinfinitescrollheightmapprops.md)
* [IInfiniteScrollInternalProps](interfaces/iinfinitescrollinternalprops.md)
* [IInfiniteScrollProps](interfaces/iinfinitescrollprops.md)
* [IModelProps](interfaces/imodelprops.md)
* [INewModelProps](interfaces/inewmodelprops.md)
* [IQueryProps](interfaces/iqueryprops.md)
* [IShowLoadingIndicator](interfaces/ishowloadingindicator.md)
* [IWithLoadingIndicatorProps](interfaces/iwithloadingindicatorprops.md)
* [IWithModelProps](interfaces/iwithmodelprops.md)
* [IWithModelQueryOptions](interfaces/iwithmodelqueryoptions.md)
* [IWithModelQueryProps](interfaces/iwithmodelqueryprops.md)

### Variables

* [DisplayPreviousPage](#displaypreviouspage)
* [InfiniteScroll](#infinitescroll)
* [Model](#model)
* [NewModel](#newmodel)
* [Query](#query)

### Functions

* [DefaultContentPlaceHolder](#defaultcontentplaceholder)
* [DefaultLoadingComponent](#defaultloadingcomponent)
* [average](#average)
* [configure](#configure)
* [defaultShowLoadingIndicator](#defaultshowloadingindicator)
* [getConfiguration](#getconfiguration)
* [omitProps](#omitprops)
* [seedServiceListWithPagingOptions](#seedservicelistwithpagingoptions)
* [simulateScrollEvent](#simulatescrollevent)
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

<a id="displaypreviouspage"></a>

### `<Const>` DisplayPreviousPage

**● DisplayPreviousPage**: *`ComponentClass`<[IDisplayPreviousPageProps](interfaces/idisplaypreviouspageprops.md)<`any`>>* =  compose<IDisplayPreviousPageProps<any>, IDisplayPreviousPageProps<any>>(
  setDisplayName("DisplayPreviousPage"),
  pure,
)(
  (({ queryManager, modelName, modelComponent: ModelComponent, modelComponentProps }) => {
    return queryManager.hasPreviousPage() && (
      <Query key={`page-${queryManager.response.previousPage}`} modelName={modelName} query={queryManager.getPreviousPage()}>
        {({ query }) => (
          <>
            <DisplayPreviousPage queryManager={query} modelComponent={ModelComponent} modelComponentProps={modelComponentProps} modelName={modelName} />
            {query.items.map(model => (
              <ModelComponent key={model.id} model={model} {...modelComponentProps} />
            ))}
          </>
        )}
      </Query>
    );
  }),
)

*Defined in [Components/InfiniteScroll.tsx:53](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Components/InfiniteScroll.tsx#L53)*

___
<a id="infinitescroll"></a>

### `<Const>` InfiniteScroll

**● InfiniteScroll**: *`ComponentClass`<[IInfiniteScrollProps](interfaces/iinfinitescrollprops.md)<`any`>>* =  compose<IInfiniteScrollInternalProps<any>, IInfiniteScrollProps<any>>(
  setDisplayName("InfiniteScroll"),
  defaultProps({
    debounceTime: 200,
    disableVirtualScrolling: false,
    contentPlaceHolderComponent: DefaultContentPlaceHolder,
  }),
  withProps(
    {
      currentPageHeightRef: React.createRef(),
      previousPageHeightRef: React.createRef(),
      nextPageHeightRef: React.createRef(),
    }),
  withStateHandlers<IInfiniteScrollHeightMapProps, { recordPageHeight }, IInfiniteScrollInternalProps<any>>(
    { pageHeightMap: {}, estimatedPageHeight: 0 },
    {
      recordPageHeight: () =>
        (pageHeightMap: { [key: string]: number }) => ({
          pageHeightMap,
          estimatedPageHeight: average(Object.values(pageHeightMap)),
        }),
    },
  ),
  withState<IInfiniteScrollProps<any>, IQueryBuilder, "query", "updateQuery">("query", "updateQuery", ({ query, modelName }) => {
    return query instanceof QueryBuilder
      ? query
      : new QueryBuilder(modelName, query as IQueryParams);
  }),
  withModelQuery(),
  withPropsOnChange(["query", "estimatedPageHeight"], ({ query, pageHeightMap, estimatedPageHeight }) => {
    let previousPlaceHolderHeight = 0;
    let nextPlaceHolderHeight = 0;

    for (let x = query.response.currentPage - 2; x > 0; x--) {
      previousPlaceHolderHeight += x in pageHeightMap
        ? pageHeightMap[x]
        : estimatedPageHeight;
    }

    for (let x = query.response.currentPage + 2; x <= query.response.totalPages; x++) {
      nextPlaceHolderHeight += x in pageHeightMap
        ? pageHeightMap[x]
        : estimatedPageHeight;
    }

    return {
      previousPlaceHolderHeight,
      nextPlaceHolderHeight,
    };
  }),
  withHandlers({
    updatePageHeightMap: ({
      currentPageHeightRef,
      nextPageHeightRef,
      pageHeightMap,
      previousPageHeightRef,
      recordPageHeight,
    }) => (query) => {
      const currentPageHeight = currentPageHeightRef.current.getBoundingClientRect().height;
      let previousPageHeight;
      let nextPageHeight;

      const updatedPageHeightMap = {
        ...pageHeightMap,
        [query.response.currentPage]: currentPageHeight,
      };

      if (query.hasPreviousPage()) {
        previousPageHeight = previousPageHeightRef.current.getBoundingClientRect().height;
        updatedPageHeightMap[query.response.previousPage] = previousPageHeight;
      }

      if (query.hasNextPage()) {
        nextPageHeight = nextPageHeightRef.current.getBoundingClientRect().height;
        updatedPageHeightMap[query.response.nextPage] = nextPageHeight;
      }

      recordPageHeight(updatedPageHeightMap);
      return updatedPageHeightMap;
    },
  }),
  withStateHandlers<{ lastScrollTop: number }, { handleScroll }, IInfiniteScrollInternalProps<any>>(
    { lastScrollTop: 0 },
    {
      handleScroll: ({ lastScrollTop }, { disableVirtualScrolling, estimatedPageHeight, query, updatePageHeightMap, updateQuery }) =>
        (clientHeight: number, scrollHeight: number, currentScrollTop: number) => {
          const scrollingDown = currentScrollTop > lastScrollTop;
          const currentScrollBottom = scrollHeight - currentScrollTop - clientHeight;

          if (!disableVirtualScrolling) {
            const updatedPageHeightMap = updatePageHeightMap(query);

            let nextPageToLoad = 1;
            let nextPageScrollTop = updatedPageHeightMap[1];

            while (nextPageScrollTop < (currentScrollTop + (clientHeight / 2)) && nextPageToLoad < query.response.totalPages) {
              nextPageToLoad++;
              nextPageScrollTop += nextPageToLoad in updatedPageHeightMap
                ? updatedPageHeightMap[nextPageToLoad]
                : estimatedPageHeight;
            }

            if (query.response.currentPage !== nextPageToLoad) {
              updateQuery(query.query.page(nextPageToLoad));
            }
          } else if (scrollingDown && currentScrollBottom < (clientHeight / 2) && query.hasNextPage()) {
            updateQuery(query.getNextPage());
          }

          return { lastScrollTop: currentScrollTop };
        },
    },
  ),
  withPropsOnChange(["debounceTime"], ({ debounceTime, handleScroll }) => ({
    handleScrollDebounced: debounce(handleScroll, debounceTime),
    handleScrollThrottled: throttle(handleScroll, debounceTime),
  })),
  withHandlers({
    handleScrollPersistingEvent: ({ handleScrollDebounced, handleScrollThrottled }) => (event: any) => {
      const clientHeight = event.target.clientHeight;
      const scrollHeight = event.target.scrollHeight;
      const scrollTop = event.target.scrollTop;

      handleScrollThrottled(clientHeight, scrollHeight, scrollTop);
      handleScrollDebounced(clientHeight, scrollHeight, scrollTop);
    },
  }),
  lifecycle<{ disableVirtualScrolling, handleScrollDebounced, handleScrollThrottled, query: IQueryManager<any>, updatePageHeightMap }, {}>({
    componentDidMount() {
      if (!this.props.disableVirtualScrolling) {
        // Initialize page height map and estimated page height
        this.props.updatePageHeightMap(this.props.query);
      }
    },
    componentWillUnmount() {
      this.props.handleScrollDebounced.cancel();
      this.props.handleScrollThrottled.cancel();
    },
  }),
  omitProps([
    "debounceTime",
    "handleScroll",
    "handleScrollDebounced",
    "handleScrollThrottled",
    "lastScrollTop",
    "recordPageHeight",
    "updateQuery",
    "updatePageHeightMap",
  ]),
  pure,
)(({
  containerComponent: ContainerComponent,
  contentPlaceHolderComponent: ContentPlaceHolder,
  currentPageHeightRef,
  disableVirtualScrolling,
  estimatedPageHeight,
  handleScrollPersistingEvent,
  modelComponent: ModelComponent,
  modelComponentProps,
  modelName,
  nextPageHeightRef,
  nextPlaceHolderHeight,
  pageHeightMap,
  previousPageHeightRef,
  previousPlaceHolderHeight,
  query: queryManager,
  ...containerProps }) => (
    <ContainerComponent {...containerProps} onScroll={handleScrollPersistingEvent}>
      {disableVirtualScrolling &&
        <DisplayPreviousPage queryManager={queryManager} modelComponent={ModelComponent} modelComponentProps={modelComponentProps} modelName={modelName} />
      }
      {queryManager.hasPreviousPage() && !disableVirtualScrolling &&
        <>
          <ContentPlaceHolder height={previousPlaceHolderHeight} />

          <span ref={previousPageHeightRef}>
            <Query
              modelName={modelName}
              query={queryManager.getPreviousPage()}
              loadingComponent={ContentPlaceHolder}
              loadingComponentProps={{ height: pageHeightMap[queryManager.response.previousPage] || estimatedPageHeight }}
            >
              {({ query }) => (
                query.items.map(model => (
                  <ModelComponent key={model.id} model={model} {...modelComponentProps} />
                ))
              )}
            </Query>
          </span>
        </>
      }

      <span ref={currentPageHeightRef}>
        {queryManager.items.map(model => (
          <ModelComponent key={model.id} model={model} {...modelComponentProps} />
        ))}
      </span>

      {queryManager.hasNextPage() && (
        <>
          <span ref={nextPageHeightRef}>
            <Query
              modelName={modelName}
              query={queryManager.getNextPage()}
              loadingComponent={ContentPlaceHolder}
              loadingComponentProps={{ height: pageHeightMap[queryManager.response.nextPage] || estimatedPageHeight }}
            >
              {({ query }) => (
                query.items.map(model => (
                  <ModelComponent key={model.id} model={model} {...modelComponentProps} />
                ))
              )}
            </Query>
          </span>

          {!disableVirtualScrolling &&
            <ContentPlaceHolder height={nextPlaceHolderHeight} />
          }
        </>
      )
      }
    </ContainerComponent>
  ))

*Defined in [Components/InfiniteScroll.tsx:92](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Components/InfiniteScroll.tsx#L92)*

Adds infinite and virtual scroll capability to a container and model component, querying for the next page of results when scrolling down (or up if virtual scrolling). The container component must be scrollable.

___
<a id="model"></a>

### `<Const>` Model

**● Model**: * `ComponentClass`<[IModelProps](interfaces/imodelprops.md)> &#124; `StatelessComponent`<[IModelProps](interfaces/imodelprops.md)>
* =  withRenderProps<IModelProps>(withModel())

*Defined in [Model.tsx:10](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Model.tsx#L10)*

___
<a id="newmodel"></a>

### `<Const>` NewModel

**● NewModel**: * `ComponentClass`<[INewModelProps](interfaces/inewmodelprops.md)> &#124; `StatelessComponent`<[INewModelProps](interfaces/inewmodelprops.md)>
* =  withRenderProps<INewModelProps>(withNewModel())

*Defined in [NewModel.tsx:11](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/NewModel.tsx#L11)*

___
<a id="query"></a>

### `<Const>` Query

**● Query**: * `ComponentClass`<[IQueryProps](interfaces/iqueryprops.md)> &#124; `StatelessComponent`<[IQueryProps](interfaces/iqueryprops.md)>
* =  withRenderProps<IQueryProps>(withModelQuery())

*Defined in [Query.tsx:12](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Query.tsx#L12)*

___

## Functions

<a id="defaultcontentplaceholder"></a>

### `<Const>` DefaultContentPlaceHolder

▸ **DefaultContentPlaceHolder**(__namedParameters: *`object`*): `Element`

*Defined in [Components/InfiniteScroll.tsx:77](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Components/InfiniteScroll.tsx#L77)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| __namedParameters | `object` |

**Returns:** `Element`

___
<a id="defaultloadingcomponent"></a>

### `<Const>` DefaultLoadingComponent

▸ **DefaultLoadingComponent**(): `Element`

*Defined in [DefaultLoadingComponent.tsx:3](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/DefaultLoadingComponent.tsx#L3)*

**Returns:** `Element`

___
<a id="average"></a>

###  average

▸ **average**(items: *`number`[]*): `number`

*Defined in [Helpers/Average.ts:4](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Helpers/Average.ts#L4)*

Computes the average of the given array of numbers

**Parameters:**

| Param | Type |
| ------ | ------ |
| items | `number`[] |

**Returns:** `number`

___
<a id="configure"></a>

###  configure

▸ **configure**(config: *[IConfiguration](interfaces/iconfiguration.md)*): `void`

*Defined in [Configure.ts:15](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Configure.ts#L15)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| config | [IConfiguration](interfaces/iconfiguration.md) |

**Returns:** `void`

___
<a id="defaultshowloadingindicator"></a>

### `<Const>` defaultShowLoadingIndicator

▸ **defaultShowLoadingIndicator**(__namedParameters: *`object`*): `boolean`

*Defined in [WithLoadingIndicator.tsx:16](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/WithLoadingIndicator.tsx#L16)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| __namedParameters | `object` |

**Returns:** `boolean`

___
<a id="getconfiguration"></a>

###  getConfiguration

▸ **getConfiguration**(): [IConfiguration](interfaces/iconfiguration.md)

*Defined in [Configure.ts:11](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Configure.ts#L11)*

**Returns:** [IConfiguration](interfaces/iconfiguration.md)

___
<a id="omitprops"></a>

###  omitProps

▸ **omitProps**P(keys: *`keyof P`[]*): `InferableComponentEnhancerWithProps`<`P`, `object`>

*Defined in [Helpers/OmitProps.ts:4](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Helpers/OmitProps.ts#L4)*

**Type parameters:**

#### P 
**Parameters:**

| Param | Type |
| ------ | ------ |
| keys | `keyof P`[] |

**Returns:** `InferableComponentEnhancerWithProps`<`P`, `object`>

___
<a id="seedservicelistwithpagingoptions"></a>

###  seedServiceListWithPagingOptions

▸ **seedServiceListWithPagingOptions**(serviceName: *`string`*, pageSize: *`number`*, totalPages: *`number`*): `void`

*Defined in [TestUtils/SeedHelper.ts:10](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/TestUtils/SeedHelper.ts#L10)*

Seeds a given service with a specified number of paged data

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| serviceName | `string` |
| pageSize | `number` |  the size of each page seeded into the service |
| totalPages | `number` |  total amount of pages to seed the service with |

**Returns:** `void`

___
<a id="simulatescrollevent"></a>

###  simulateScrollEvent

▸ **simulateScrollEvent**(wrapper: *`any`*, selector: *`any`*, mock?: *`any`*): `void`

*Defined in [TestUtils/UIEventSimulation.ts:8](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/TestUtils/UIEventSimulation.ts#L8)*

Simulates an onScroll event.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| wrapper | `any` |  the enzyme wrapper |
| selector | `any` |  the scrollable element |
| `Optional` mock | `any` |  optional mock event object to be passed in to the event handler ex: { currentTarget: { scrollTop: 50 } } |

**Returns:** `void`

___
<a id="usingmount"></a>

###  usingMount

▸ **usingMount**(component: * `React.ComponentType`<`any`> &#124; `Element`*, whileMounted: *`function`*, mountOptions?: *`object`*):  `Promise`<`any`> &#124; `void`

*Defined in [TestUtils/EnzymeHelper.tsx:11](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/TestUtils/EnzymeHelper.tsx#L11)*

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

*Defined in [WithLoadingIndicator.tsx:26](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/WithLoadingIndicator.tsx#L26)*

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

▸ **withModel**P(options?: *[IWithModelProps](interfaces/iwithmodelprops.md)*): `ComponentEnhancer`<`P`,  `P` & [IWithModelProps](interfaces/iwithmodelprops.md)>

*Defined in [WithModel.ts:31](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/WithModel.ts#L31)*

An HOC to inject a model into a component given the name of the DataService for that model.

Automatically updates (rerenders) the component when the observable updates and automatically unsubscribes on unmount

**Type parameters:**

#### P 
**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` options | [IWithModelProps](interfaces/iwithmodelprops.md) |

**Returns:** `ComponentEnhancer`<`P`,  `P` & [IWithModelProps](interfaces/iwithmodelprops.md)>

___
<a id="withmodelarray"></a>

###  withModelArray

▸ **withModelArray**P(dataServiceName: *`string`*, idPropKey?: *`string`*, modelPropKey?: *`string`*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithModelArray.ts:16](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/WithModelArray.ts#L16)*

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

*Defined in [WithModelQuery.ts:32](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/WithModelQuery.ts#L32)*

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

▸ **withNewModel**P(options?: *[IWithModelProps](interfaces/iwithmodelprops.md)*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithNewModel.tsx:15](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/WithNewModel.tsx#L15)*

An HOC which returns a new unsaved model if one is not provided.

**Type parameters:**

#### P 
**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` options | [IWithModelProps](interfaces/iwithmodelprops.md) |

**Returns:** `ComponentEnhancer`<`P`, `P`>

___

## Object literals

<a id="configuration"></a>

### `<Let>` configuration

**configuration**: *`object`*

*Defined in [Configure.ts:7](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Configure.ts#L7)*

<a id="configuration.loadingcomponent"></a>

####  loadingComponent

**● loadingComponent**: *[DefaultLoadingComponent]()* =  DefaultLoadingComponent

*Defined in [Configure.ts:8](https://github.com/Rediker-Software/redux-data-service-react/blob/a3ddc60/src/Configure.ts#L8)*

___

___

