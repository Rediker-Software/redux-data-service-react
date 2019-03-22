
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

`withModelFormBody(model: T, readOnly: boolean)`
------------------------------------------------

A higher-order component to wrap the inputs of the body of a ModelForm.

*   The given `model` and `readOnly` props will be passed along as child context, where they will be used by the `ModelField`.

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
* [IDelayedHandlers](interfaces/idelayedhandlers.md)
* [IFakeComponentProps](interfaces/ifakecomponentprops.md)
* [IFieldContext](interfaces/ifieldcontext.md)
* [IFieldInputProps](interfaces/ifieldinputprops.md)
* [IInfiniteScrollInternalProps](interfaces/iinfinitescrollinternalprops.md)
* [IInfiniteScrollPreviousPageInternalProps](interfaces/iinfinitescrollpreviouspageinternalprops.md)
* [IInfiniteScrollPreviousPageProps](interfaces/iinfinitescrollpreviouspageprops.md)
* [IInfiniteScrollProps](interfaces/iinfinitescrollprops.md)
* [IInfiniteScrollStateProps](interfaces/iinfinitescrollstateprops.md)
* [IModelFieldProps](interfaces/imodelfieldprops.md)
* [IModelFormBodyProps](interfaces/imodelformbodyprops.md)
* [IModelFormInternalProps](interfaces/imodelforminternalprops.md)
* [IModelFormProps](interfaces/imodelformprops.md)
* [IModelProps](interfaces/imodelprops.md)
* [INewModelProps](interfaces/inewmodelprops.md)
* [IQueryProps](interfaces/iqueryprops.md)
* [IWithDelayedHandlers](interfaces/iwithdelayedhandlers.md)
* [IWithLoadingIndicatorProps](interfaces/iwithloadingindicatorprops.md)
* [IWithModelProps](interfaces/iwithmodelprops.md)
* [IWithModelQueryMappedProps](interfaces/iwithmodelquerymappedprops.md)
* [IWithModelQueryOptions](interfaces/iwithmodelqueryoptions.md)
* [IWithModelQueryProps](interfaces/iwithmodelqueryprops.md)

### Type aliases

* [DelayedHandler](#delayedhandler)

### Variables

* [DELAY_TIMEOUT](#delay_timeout)
* [InfiniteScroll](#infinitescroll)
* [InfiniteScrollPreviousPage](#infinitescrollpreviouspage)
* [Model](#model)
* [ModelField](#modelfield)
* [ModelForm](#modelform)
* [NewModel](#newmodel)
* [Query](#query)

### Functions

* [DefaultContentPlaceHolder](#defaultcontentplaceholder)
* [DefaultLoadingComponent](#defaultloadingcomponent)
* [Field](#field)
* [Form](#form)
* [average](#average)
* [calculateGroupHeight](#calculategroupheight)
* [configure](#configure)
* [defaultValidateField](#defaultvalidatefield)
* [getConfiguration](#getconfiguration)
* [omitProps](#omitprops)
* [seedServiceListWithPagingOptions](#seedservicelistwithpagingoptions)
* [simulateBlurEvent](#simulateblurevent)
* [simulateCheckboxInput](#simulatecheckboxinput)
* [simulateFocusEvent](#simulatefocusevent)
* [simulateFormInput](#simulateforminput)
* [simulateRadioInput](#simulateradioinput)
* [simulateScrollEvent](#simulatescrollevent)
* [simulateSelection](#simulateselection)
* [simulateTextInput](#simulatetextinput)
* [usingMount](#usingmount)
* [withDelayedHandlers](#withdelayedhandlers)
* [withLoadingIndicator](#withloadingindicator)
* [withModel](#withmodel)
* [withModelArray](#withmodelarray)
* [withModelFormBody](#withmodelformbody)
* [withModelQuery](#withmodelquery)
* [withNewModel](#withnewmodel)

### Object literals

* [configuration](#configuration)

---

## Type aliases

<a id="delayedhandler"></a>

###  DelayedHandler

**Ƭ DelayedHandler**: *`function`*

*Defined in [WithDelayedHandlers.ts:5](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/WithDelayedHandlers.ts#L5)*

#### Type declaration
▸(...args: *`any`*): `function`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `any` |

**Returns:** `function`

___

## Variables

<a id="delay_timeout"></a>

### `<Const>` DELAY_TIMEOUT

**● DELAY_TIMEOUT**: *`200`* = 200

*Defined in [WithDelayedHandlers.ts:17](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/WithDelayedHandlers.ts#L17)*

___
<a id="infinitescroll"></a>

### `<Const>` InfiniteScroll

**● InfiniteScroll**: *`ComponentClass`<[IInfiniteScrollProps](interfaces/iinfinitescrollprops.md)<`any`>>* =  compose<IInfiniteScrollInternalProps<any>, IInfiniteScrollProps<any>>(
  setDisplayName("InfiniteScroll"),
  defaultProps({
    contentPlaceHolderComponent: DefaultContentPlaceHolder,
  }),
  withStateHandlers<IInfiniteScrollStateProps<any>, { updateState, updateStateFromQuery }, IInfiniteScrollProps<any>>(
    ({ query, modelName }) => ({
      currentItems: null,
      currentPage: 1,
      currentPageStartMarkerRef: React.createRef(),
      currentPageEndMarkerRef: React.createRef(),
      hasNextPage: false,
      hasPreviousPage: false,
      lastScrollTop: 0,
      nextPage: null,
      nextPageEndMarkerRef: React.createRef(),
      nextPageQuery: null,
      nextPageStartMarkerRef: React.createRef(),
      nextPlaceHolderHeight: 0,
      pageHeightMap: {},
      previousPage: null,
      previousPageEndMarkerRef: React.createRef(),
      previousPageQuery: null,
      previousPageStartMarkerRef: React.createRef(),
      previousPlaceHolderHeight: 0,
      query: query instanceof QueryBuilder
        ? query
        : new QueryBuilder(modelName, query as IQueryParams),
      totalPages: 0,
    }),
    {
      updateState: () => newState => newState,
      updateStateFromQuery: () => (queryManager: IQueryManager<any>) => ({
        currentItems: queryManager.items,
        currentPage: queryManager.response.currentPage,
        nextPage: queryManager.response.nextPage,
        nextPageQuery: queryManager.getNextPage(),
        hasNextPage: queryManager.hasNextPage(),
        hasPreviousPage: queryManager.hasPreviousPage(),
        previousPage: queryManager.response.previousPage,
        previousPageQuery: queryManager.getPreviousPage(),
        totalPages: queryManager.response.totalPages,
      }),
    },
  ),
  withModelQuery(),
  withPropsOnChange(["currentPage", "pageHeightMap", "totalPages"], ({
    currentPage,
    pageHeightMap,
    totalPages,
  }) => {
    let previousPlaceHolderHeight = 0;
    let nextPlaceHolderHeight = 0;

    const estimatedPageHeight = average(Object.values(pageHeightMap));

    for (let x = currentPage - 2; x > 0; x--) {
      previousPlaceHolderHeight += x in pageHeightMap
        ? pageHeightMap[x]
        : estimatedPageHeight;
    }

    for (let x = currentPage + 2; x <= totalPages; x++) {
      nextPlaceHolderHeight += x in pageHeightMap
        ? pageHeightMap[x]
        : estimatedPageHeight;
    }

    return {
      estimatedPageHeight,
      nextPlaceHolderHeight,
      previousPlaceHolderHeight,
    };
  }),
  withDelayedHandlers({
    updatePageHeightMap: ({
      currentPage,
      currentPageEndMarkerRef,
      currentPageStartMarkerRef,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      nextPageEndMarkerRef,
      nextPageStartMarkerRef,
      pageHeightMap,
      previousPage,
      previousPageEndMarkerRef,
      previousPageStartMarkerRef,
      updateState,
    }) => () => () => {
      const updatedPageHeightMap = {};

      if (currentPageStartMarkerRef.current) {
        const currentPageHeight = calculateGroupHeight(
          currentPageStartMarkerRef.current.nextSibling,
          currentPageEndMarkerRef.current.previousSibling,
        );

        if (currentPageHeight !== pageHeightMap[currentPage]) {
          updatedPageHeightMap[currentPage] = currentPageHeight;
        }
      }

      if (hasPreviousPage && previousPageStartMarkerRef.current) {
        const previousPageHeight = calculateGroupHeight(
          previousPageStartMarkerRef.current.nextSibling,
          previousPageEndMarkerRef.current.previousSibling,
        );

        if (previousPageHeight !== pageHeightMap[previousPage]) {
          updatedPageHeightMap[previousPage] = previousPageHeight;
        }
      }

      if (hasNextPage && nextPageStartMarkerRef.current) {
        const nextPageHeight = calculateGroupHeight(
          nextPageStartMarkerRef.current.nextSibling,
          nextPageEndMarkerRef.current.previousSibling,
        );

        if (nextPageHeight !== pageHeightMap[nextPage]) {
          updatedPageHeightMap[nextPage] = nextPageHeight;
        }
      }

      if (!isEmpty(updatedPageHeightMap)) {
        pageHeightMap = {
          ...pageHeightMap,
          ...updatedPageHeightMap
        };

        updateState({
          pageHeightMap
        });
      }
    },
    handleScroll: ({
      currentPage,
      disableVirtualScrolling,
      estimatedPageHeight,
      hasNextPage,
      lastScrollTop,
      nextPageQuery,
      pageHeightMap,
      query,
      totalPages,
      updateState,
    }) => ({ target: { clientHeight, scrollHeight, scrollTop } }) => () => {
      const updatedState = {
        lastScrollTop: scrollTop
      } as Partial<IInfiniteScrollStateProps<any>>;

      const scrollingDown = scrollTop > lastScrollTop;
      const currentScrollBottom = scrollHeight - scrollTop - clientHeight;

      if (!disableVirtualScrolling) {
        let nextPageToLoad = 1;
        let nextPageScrollTop = pageHeightMap[1];

        while (nextPageScrollTop < (scrollTop + (clientHeight / 2)) && nextPageToLoad < totalPages) {
          nextPageToLoad++;
          nextPageScrollTop += nextPageToLoad in pageHeightMap
            ? pageHeightMap[nextPageToLoad]
            : estimatedPageHeight;
        }

        if (currentPage !== nextPageToLoad) {
          updatedState.query = query.query.page(nextPageToLoad);
        }
      } else if (hasNextPage && scrollingDown && currentScrollBottom < (clientHeight / 2)) {
        updatedState.query = nextPageQuery;
      }

      updateState(updatedState);
    },
  }),
  pure,
  lifecycle<IInfiniteScrollInternalProps<any>, {}>({
    componentDidMount() {
      if (this.props.query.response) {
        this.props.updateStateFromQuery(this.props.query);
      }
    },
    componentDidUpdate(prevProps) {
      if (prevProps.query !== this.props.query && this.props.query.response) {
        this.props.updateStateFromQuery(this.props.query);
      } else if (this.props.currentItems && this.props.pageHeightMap === prevProps.pageHeightMap) {
        this.props.updatePageHeightMap();
      }
    },
  }),
  omitProps([
    "currentPage",
    "items",
    "lastScrollTop",
    "loadingComponent",
    "loadingComponentProps",
    "totalPages",
    "updatePageHeightMap",
    "updateState",
    "updateStateFromQuery",
  ]),
)(({
  containerComponent: ContainerComponent,
  contentPlaceHolderComponent: ContentPlaceHolder,
  contentPlaceHolderComponentProps,
  currentItems,
  currentPageEndMarkerRef,
  currentPageStartMarkerRef,
  disableVirtualScrolling,
  estimatedPageHeight,
  handleScroll,
  hasNextPage,
  hasPreviousPage,
  modelComponent: ModelComponent,
  modelComponentProps,
  modelName,
  nextPage,
  nextPageEndMarkerRef,
  nextPageQuery,
  nextPageStartMarkerRef,
  nextPlaceHolderHeight,
  pageHeightMap,
  previousPage,
  previousPageEndMarkerRef,
  previousPageQuery,
  previousPlaceHolderHeight,
  previousPageStartMarkerRef,
  ...containerProps
}) => (
  <ContainerComponent {...containerProps} onScroll={handleScroll}>
    {hasPreviousPage && (
      disableVirtualScrolling
        ? (
          <InfiniteScrollPreviousPage
            modelComponent={ModelComponent}
            modelComponentProps={modelComponentProps}
            query={previousPageQuery}
          />
        ) : (
          <>
            <ContentPlaceHolder
              height={previousPlaceHolderHeight}
              {...contentPlaceHolderComponentProps}
            />

            <script ref={previousPageStartMarkerRef} />

            <Query
              modelName={modelName}
              query={previousPageQuery}
              loadingComponent={ContentPlaceHolder}
              loadingComponentProps={{ height: pageHeightMap[previousPage] || estimatedPageHeight }}
            >
              {({ query }) => (
                query.items.map(model => (
                  <ModelComponent key={model.id} model={model} {...modelComponentProps} />
                ))
              )}
            </Query>

            <script ref={previousPageEndMarkerRef} />
          </>
        )
    )}

    <script ref={currentPageStartMarkerRef} />

    {(
      currentItems == null
        ? <ContentPlaceHolder height="100%" {...contentPlaceHolderComponentProps} />
        : currentItems.map(model => (
          <ModelComponent key={model.id} model={model} {...modelComponentProps} />
        ))
    )}

    <script ref={currentPageEndMarkerRef} />

    {hasNextPage && (
      <>
        <script ref={nextPageStartMarkerRef} />

        <Query
          modelName={modelName}
          query={nextPageQuery}
          loadingComponent={ContentPlaceHolder}
          loadingComponentProps={{ height: pageHeightMap[nextPage] || estimatedPageHeight }}
        >
          {({ query }) => (
            query.items.map(model => (
              <ModelComponent key={model.id} model={model} {...modelComponentProps} />
            ))
          )}
        </Query>

        <script ref={nextPageEndMarkerRef} />

        {!disableVirtualScrolling && (
          <ContentPlaceHolder
            height={nextPlaceHolderHeight}
            {...contentPlaceHolderComponentProps}
          />
        )}
      </>
    )}
  </ContainerComponent>
))

*Defined in [Components/InfiniteScroll.tsx:87](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Components/InfiniteScroll.tsx#L87)*

Adds infinite and virtual scroll capability to a container and model component, querying for the next page of results when scrolling down (or up if virtual scrolling). The container component must be scrollable.

___
<a id="infinitescrollpreviouspage"></a>

### `<Const>` InfiniteScrollPreviousPage

**● InfiniteScrollPreviousPage**: *`ComponentClass`<[IInfiniteScrollPreviousPageProps](interfaces/iinfinitescrollpreviouspageprops.md)>* =  compose<IInfiniteScrollPreviousPageInternalProps, IInfiniteScrollPreviousPageProps>(
  setDisplayName("InfiniteScrollPreviousPage"),
  pure,
  withModelQuery({ isLoading: ({ query }) => query.response == null }),
)(({
  query,
  modelComponent: ModelComponent,
  modelComponentProps
}) => (
  <React.Fragment key={`page-${query.response.currentPage}`}>
    {query.hasPreviousPage() && (
      <InfiniteScrollPreviousPage
        query={query.getPreviousPage()}
        modelComponent={ModelComponent}
        modelComponentProps={modelComponentProps}
      />
    )}
    {query.items.map(model => (
      <ModelComponent key={model.id} model={model} {...modelComponentProps} />
    ))}
  </React.Fragment>
))

*Defined in [Components/InfiniteScrollPreviousPage.tsx:19](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Components/InfiniteScrollPreviousPage.tsx#L19)*

___
<a id="model"></a>

### `<Const>` Model

**● Model**: *`ComponentClass`<[IModelProps](interfaces/imodelprops.md)> \| `StatelessComponent`<[IModelProps](interfaces/imodelprops.md)>* =  withRenderProps<IModelProps>(withModel())

*Defined in [Model.tsx:10](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Model.tsx#L10)*

___
<a id="modelfield"></a>

### `<Const>` ModelField

**● ModelField**: *`ComponentClass`<[IModelFieldProps](interfaces/imodelfieldprops.md)<`any`>>* =  compose<IModelFieldProps, IModelFieldProps>(
  setDisplayName("ModelField"),
  defaultProps({
    validateField: defaultValidateField,
    fieldComponent: Field,
    readOnlyComponent: ({ value }) => <span>{value}</span>,
    component: (props) => <input {...props} />
  }),
  getContext({
    model: PropTypes.object,
    readOnly: PropTypes.bool
  }),
  withPropsOnChange(
    ["defaultValue", "model", "name", "readOnly"], ({ model, name, defaultValue, readOnly }) => {
      if (!readOnly && model != null && defaultValue != null && isEmpty(get(model, name))) {
        set(model, name, defaultValue);
      }
    }),
  withStateHandlers<{ active: boolean, internalErrorMessage: string }, { onChange, onFieldError, onBlur, onFocus }, IModelFieldProps>(
    { active: false, internalErrorMessage: undefined },
    {
      onChange: (state, { model, name, onChange, validateField }) => event => {

        const value = (typeof event === "object" && "target" in event)
          ? (event.target.value == null && event.target.checked) || event.target.value || null
          : event;

        set(model, name, value);

        if (onChange) {
          onChange(event);
        }

        validateField(model, name);

        return state;
      },
      onFieldError: () => (errorMessage) => ({
        internalErrorMessage: errorMessage,
      }),
      onBlur: (state, { onBlur, model, name, validateField }) => event => {
        if (onBlur) {
          onBlur(event);
        }

        validateField(model, name);

        return { active: false };
      },
      onFocus: (state, { onFocus }) => event => {
        if (onFocus) {
          onFocus(event);
        }

        return { active: true };
      },
    },
  ),
  withContext({ field: PropTypes.object }, ({ active, onFieldError, model, name, internalErrorMessage }) => {
    const fieldErrors = model.getFieldError(name);
    const errorMessage = !isEmpty(fieldErrors)
      ? fieldErrors
      : internalErrorMessage;

    const isFieldDirty = model.isFieldDirty(name);

    return {
      field: {
        active,
        errorMessage,
        isFieldDirty,
        onFieldError,
      }
    };
  }),
  withPropsOnChange(["model", "readOnlyFieldName", "name", "readOnly"], ({
    model,
    readOnlyFieldName,
    name,
    readOnly,
  }: IModelFieldProps) => ({
    value: readOnly && readOnlyFieldName
      ? get(model, readOnlyFieldName)
      : get(model, name)
  })),
  omitProps(["model", "active", "internalErrorMessage", "onFieldError", "defaultValue", "validateField", "readOnlyFieldName"])
)(({ fieldComponent: FieldComponent, ...props }) => <FieldComponent {...props} />)

*Defined in [Components/ModelField.tsx:56](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Components/ModelField.tsx#L56)*

___
<a id="modelform"></a>

### `<Const>` ModelForm

**● ModelForm**: *`ComponentClass`<[IModelFormProps](interfaces/imodelformprops.md)>* =  compose<IModelFormInternalProps, IModelFormProps>(
  setDisplayName("ModelForm"),
  defaultProps({
    formComponent: Form,
    readOnly: false
  }),
  withHandlers<IModelFormProps, { onSubmit }>({
    onSubmit: (props) => (e) => {
      e.preventDefault();

      const {
        model,
        onSave,
        onError
      } = props;

      model
        .save()
        .then(onSave, onError);
    },
    onReset: (props) => (e) => {
      e.preventDefault();

      const { model, onCancel } = props;
      model.reset();

      if (onCancel) {
        onCancel();
      }
    },
  }),
  withLoadingIndicator({ isLoading: ({ model }) => model == null }),
  withModelFormBody(),
  omitProps([ "model", "onCancel", "onError", "onSave" ])
)(({ formComponent: FormComponent, ...props }) => <FormComponent {...props} />)

*Defined in [Components/ModelForm.tsx:37](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Components/ModelForm.tsx#L37)*

Creates a form whose values are lifted from and modify the given model. When the form is saved, the model is saved. The form supports read only mode which is passed to it's children via context.

*__returns__*: 

___
<a id="newmodel"></a>

### `<Const>` NewModel

**● NewModel**: *`ComponentClass`<[INewModelProps](interfaces/inewmodelprops.md)> \| `StatelessComponent`<[INewModelProps](interfaces/inewmodelprops.md)>* =  withRenderProps<INewModelProps>(withNewModel())

*Defined in [NewModel.tsx:11](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/NewModel.tsx#L11)*

___
<a id="query"></a>

### `<Const>` Query

**● Query**: *`ComponentClass`<[IQueryProps](interfaces/iqueryprops.md)> \| `StatelessComponent`<[IQueryProps](interfaces/iqueryprops.md)>* =  withRenderProps<IQueryProps>(withModelQuery())

*Defined in [Query.tsx:12](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Query.tsx#L12)*

___

## Functions

<a id="defaultcontentplaceholder"></a>

### `<Const>` DefaultContentPlaceHolder

▸ **DefaultContentPlaceHolder**(__namedParameters: *`object`*): `Element`

*Defined in [Components/InfiniteScroll.tsx:72](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Components/InfiniteScroll.tsx#L72)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| height | `string` \| `number` |

**Returns:** `Element`

___
<a id="defaultloadingcomponent"></a>

### `<Const>` DefaultLoadingComponent

▸ **DefaultLoadingComponent**(): `Element`

*Defined in [DefaultLoadingComponent.tsx:3](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/DefaultLoadingComponent.tsx#L3)*

**Returns:** `Element`

___
<a id="field"></a>

### `<Const>` Field

▸ **Field**(__namedParameters: *`object`*): `Element`

*Defined in [Components/ModelField.tsx:50](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Components/ModelField.tsx#L50)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| Component | `any` |
| ReadOnlyComponent | `any` |
| componentProps | `any` |
| props | [props]() |
| readOnly | `any` |
| readOnlyComponentProps | `any` |

**Returns:** `Element`

___
<a id="form"></a>

### `<Const>` Form

▸ **Form**(__namedParameters: *`object`*): `Element`

*Defined in [Components/ModelForm.tsx:21](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Components/ModelForm.tsx#L21)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| children | `string` \| `number` \| `false` \| `true` \| `__type` \| `ReactElement`<`any`> \| `ReactNodeArray` \| `ReactPortal` |
| props | [props]() |

**Returns:** `Element`

___
<a id="average"></a>

###  average

▸ **average**(items: *`number`[]*): `number`

*Defined in [Helpers/Average.ts:4](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Helpers/Average.ts#L4)*

Computes the average of the given array of numbers

**Parameters:**

| Name | Type |
| ------ | ------ |
| items | `number`[] |

**Returns:** `number`

___
<a id="calculategroupheight"></a>

###  calculateGroupHeight

▸ **calculateGroupHeight**(firstElement: *`any`*, lastElement: *`any`*): `number`

*Defined in [Helpers/CalculateGroupHeight.ts:5](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Helpers/CalculateGroupHeight.ts#L5)*

Calculate the total height of a group of elements stacked vertically on a page, given the first and last elements within the group.

**Parameters:**

| Name | Type |
| ------ | ------ |
| firstElement | `any` |
| lastElement | `any` |

**Returns:** `number`

___
<a id="configure"></a>

###  configure

▸ **configure**(config: *[IConfiguration](interfaces/iconfiguration.md)*): `void`

*Defined in [Configure.ts:15](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Configure.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [IConfiguration](interfaces/iconfiguration.md) |

**Returns:** `void`

___
<a id="defaultvalidatefield"></a>

### `<Const>` defaultValidateField

▸ **defaultValidateField**(model: *`IModel`<`any`>*, name: *`string`*): `object`

*Defined in [Components/ModelField.tsx:48](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Components/ModelField.tsx#L48)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| model | `IModel`<`any`> |
| name | `string` |

**Returns:** `object`

___
<a id="getconfiguration"></a>

###  getConfiguration

▸ **getConfiguration**(): [IConfiguration](interfaces/iconfiguration.md)

*Defined in [Configure.ts:11](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Configure.ts#L11)*

**Returns:** [IConfiguration](interfaces/iconfiguration.md)

___
<a id="omitprops"></a>

###  omitProps

▸ **omitProps**<`P`>(keys: *`keyof P`[]*): `InferableComponentEnhancerWithProps`<`object`, `object`>

*Defined in [Helpers/OmitProps.ts:4](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Helpers/OmitProps.ts#L4)*

**Type parameters:**

#### P 
**Parameters:**

| Name | Type |
| ------ | ------ |
| keys | `keyof P`[] |

**Returns:** `InferableComponentEnhancerWithProps`<`object`, `object`>

___
<a id="seedservicelistwithpagingoptions"></a>

###  seedServiceListWithPagingOptions

▸ **seedServiceListWithPagingOptions**(serviceName: *`string`*, pageSize: *`number`*, totalPages: *`number`*): `void`

*Defined in [TestUtils/SeedHelper.ts:10](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/SeedHelper.ts#L10)*

Seeds a given service with a specified number of paged data

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| serviceName | `string` |
| pageSize | `number` |  the size of each page seeded into the service |
| totalPages | `number` |  total amount of pages to seed the service with |

**Returns:** `void`

___
<a id="simulateblurevent"></a>

###  simulateBlurEvent

▸ **simulateBlurEvent**(wrapper: *`any`*, fieldName: *`any`*): `void`

*Defined in [TestUtils/SimulateOnBlur.ts:7](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/SimulateOnBlur.ts#L7)*

Simulates an onBlur event

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| wrapper | `any` |  the enzyme wrapper |
| fieldName | `any` |  the name attribute of the raw input field to update |

**Returns:** `void`

___
<a id="simulatecheckboxinput"></a>

###  simulateCheckboxInput

▸ **simulateCheckboxInput**(wrapper: *`any`*, name: *`string`*, checked: *`boolean`*, value?: *`string`*): `void`

*Defined in [TestUtils/SimulateCheckboxInput.ts:9](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/SimulateCheckboxInput.ts#L9)*

Simulates clicking on a checkbox.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| wrapper | `any` |  the enzyme wrapper |
| name | `string` |  the name of the field |
| checked | `boolean` |  whether the checkbox is checked |
| `Optional` value | `string` |  the value of the checkbox |

**Returns:** `void`

___
<a id="simulatefocusevent"></a>

###  simulateFocusEvent

▸ **simulateFocusEvent**(wrapper: *`any`*, fieldName: *`any`*): `void`

*Defined in [TestUtils/SimulateOnFocus.ts:7](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/SimulateOnFocus.ts#L7)*

Simulates an onFocus event

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| wrapper | `any` |  the enzyme wrapper |
| fieldName | `any` |  the name attribute of the raw input field to update |

**Returns:** `void`

___
<a id="simulateforminput"></a>

###  simulateFormInput

▸ **simulateFormInput**(wrapper: *`any`*, newValues: *`any`*): `void`

*Defined in [TestUtils/SimulateFormInput.ts:10](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/SimulateFormInput.ts#L10)*

Simulates entering text into the fields within a form. It will simulate entering text into each of the input fields whose name attribute matches the key on the `newValues` object.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| wrapper | `any` |  the enzyme wrapper |
| newValues | `any` |  an object mapping input field name to new value |

**Returns:** `void`

___
<a id="simulateradioinput"></a>

###  simulateRadioInput

▸ **simulateRadioInput**(wrapper: *`any`*, id: *`number`*, name: *`string`*): `void`

*Defined in [TestUtils/SimulateRadioInput.ts:7](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/SimulateRadioInput.ts#L7)*

Simulates clicking on a radio button

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| wrapper | `any` |  the enzyme wrapper |
| id | `number` |  the id of the selected object |
| name | `string` |  the name of the field |

**Returns:** `void`

___
<a id="simulatescrollevent"></a>

###  simulateScrollEvent

▸ **simulateScrollEvent**(wrapper: *`any`*, selector: *`any`*, mock?: *`any`*): `void`

*Defined in [TestUtils/UIEventSimulation.ts:8](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/UIEventSimulation.ts#L8)*

Simulates an onScroll event.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| wrapper | `any` |  the enzyme wrapper |
| selector | `any` |  the scrollable element |
| `Optional` mock | `any` |  optional mock event object to be passed in to the event handler ex: { currentTarget: { scrollTop: 50 } } |

**Returns:** `void`

___
<a id="simulateselection"></a>

###  simulateSelection

▸ **simulateSelection**(wrapper: *`any`*, selector: *`any`*, index: *`any`*): `void`

*Defined in [TestUtils/SimulateSelection.ts:7](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/SimulateSelection.ts#L7)*

Simulates selecting an option from a Select

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| wrapper | `any` |  the enzyme wrapper |
| selector | `any` |  the element containing the Select |
| index | `any` |  the index of the element |

**Returns:** `void`

___
<a id="simulatetextinput"></a>

###  simulateTextInput

▸ **simulateTextInput**(wrapper: *`any`*, input: *`any`*, text: *`any`*): `void`

*Defined in [TestUtils/SimulateTextInput.ts:9](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/SimulateTextInput.ts#L9)*

Simulates entering text into a field by passing event values to change and blur events

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| wrapper | `any` |  the enzyme wrapper |
| input | `any` |  the field to update |
| text | `any` |  the new text being entered into the field |

**Returns:** `void`

___
<a id="usingmount"></a>

###  usingMount

▸ **usingMount**(component: *`React.ComponentType`<`any`> \| `Element`*, whileMounted: *`function`*, mountOptions?: *`object`*): `Promise`<`any`> \| `void`

*Defined in [TestUtils/EnzymeHelper.tsx:11](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/TestUtils/EnzymeHelper.tsx#L11)*

Helper function to handle mounting and unmounting a component using enzyme to ensure resources are cleaned up.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| component | `React.ComponentType`<`any`> \| `Element` | - |  Component to mount in wrapper |
| whileMounted | `function` | - |  Function to execute while component is mounted |
| `Default value` mountOptions | `object` |  {} |  options passed into mount as second param |

**Returns:** `Promise`<`any`> \| `void`

___
<a id="withdelayedhandlers"></a>

### `<Const>` withDelayedHandlers

▸ **withDelayedHandlers**<`TOuterProps`>(handlers: *[IDelayedHandlers](interfaces/idelayedhandlers.md)<`TOuterProps`>*, options?: *[IWithDelayedHandlers](interfaces/iwithdelayedhandlers.md)*): `ComponentEnhancer`<`TOuterProps` & [IWithDelayedHandlers](interfaces/iwithdelayedhandlers.md), `TOuterProps`>

*Defined in [WithDelayedHandlers.ts:23](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/WithDelayedHandlers.ts#L23)*

An HOC which wraps recompose's `withHandlers` HOC, then wraps each of the given callback handlers with `debounce` and `throttle` from `lodash` for the given `delayTimeout`.

**Type parameters:**

#### TOuterProps 
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| handlers | [IDelayedHandlers](interfaces/idelayedhandlers.md)<`TOuterProps`> | - |
| `Default value` options | [IWithDelayedHandlers](interfaces/iwithdelayedhandlers.md) |  {} |

**Returns:** `ComponentEnhancer`<`TOuterProps` & [IWithDelayedHandlers](interfaces/iwithdelayedhandlers.md), `TOuterProps`>

___
<a id="withloadingindicator"></a>

###  withLoadingIndicator

▸ **withLoadingIndicator**<`P`>(options?: *[IWithLoadingIndicatorProps](interfaces/iwithloadingindicatorprops.md)*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithLoadingIndicator.tsx:22](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/WithLoadingIndicator.tsx#L22)*

Displays a loading component if the given test function returns true.

The default test function returns true if a prop `isLoading` is set to `true`, or if the `isLoading` prop is a `function` and it returns `true` when given the props.

If no loading component is provided either statically or as a prop, it will use the loading component specified in the configuration.

**Type parameters:**

#### P 
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` options | [IWithLoadingIndicatorProps](interfaces/iwithloadingindicatorprops.md) |  {} |

**Returns:** `ComponentEnhancer`<`P`, `P`>

___
<a id="withmodel"></a>

###  withModel

▸ **withModel**<`P`>(options?: *[IWithModelProps](interfaces/iwithmodelprops.md)*): `ComponentEnhancer`<`P`, `P` & [IWithModelProps](interfaces/iwithmodelprops.md)>

*Defined in [WithModel.ts:31](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/WithModel.ts#L31)*

An HOC to inject a model into a component given the name of the DataService for that model.

Automatically updates (rerenders) the component when the observable updates and automatically unsubscribes on unmount

**Type parameters:**

#### P 
**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` options | [IWithModelProps](interfaces/iwithmodelprops.md) |

**Returns:** `ComponentEnhancer`<`P`, `P` & [IWithModelProps](interfaces/iwithmodelprops.md)>

___
<a id="withmodelarray"></a>

###  withModelArray

▸ **withModelArray**<`P`>(dataServiceName: *`string`*, idPropKey?: *`string`*, modelPropKey?: *`string`*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithModelArray.ts:16](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/WithModelArray.ts#L16)*

An HOC to inject a model array into a component given the name of the DataService for that model and a list of ids.

Automatically updates (rerenders) the component when the observable updates and automatically unsubscribes on unmount

**Type parameters:**

#### P 
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| dataServiceName | `string` | - |
| `Default value` idPropKey | `string` |  dataServiceName + &quot;Ids&quot; |
| `Default value` modelPropKey | `string` |  plural(dataServiceName) |

**Returns:** `ComponentEnhancer`<`P`, `P`>

___
<a id="withmodelformbody"></a>

###  withModelFormBody

▸ **withModelFormBody**<`T`,`P`>(): `ComponentEnhancer`<[IModelFormBodyProps](interfaces/imodelformbodyprops.md)<`T`>, [IModelFormBodyProps](interfaces/imodelformbodyprops.md)<`T`> & `P`>

*Defined in [Components/WithModelFormBody.tsx:16](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Components/WithModelFormBody.tsx#L16)*

An HOC to wrap the inputs of the body of a ModelForm. The given `model` and `readOnly` props will be passed along as child context, where they will be used by the `ModelField`.

**Type parameters:**

#### T :  `IModel`<`any`>
#### P 

**Returns:** `ComponentEnhancer`<[IModelFormBodyProps](interfaces/imodelformbodyprops.md)<`T`>, [IModelFormBodyProps](interfaces/imodelformbodyprops.md)<`T`> & `P`>

___
<a id="withmodelquery"></a>

###  withModelQuery

▸ **withModelQuery**<`P`>(options?: *[IWithModelQueryOptions](interfaces/iwithmodelqueryoptions.md) & `P`*): `ComponentEnhancer`<`P` & [IWithModelQueryMappedProps](interfaces/iwithmodelquerymappedprops.md), `P` & [IWithModelQueryProps](interfaces/iwithmodelqueryprops.md)>

*Defined in [WithModelQuery.ts:37](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/WithModelQuery.ts#L37)*

An HOC to inject a model array into a component given the name of the DataService for that model and some query params which will be passed to the API to load those items.

Automatically updates (rerenders) the component when the observable updates and automatically unsubscribes on unmount

**Type parameters:**

#### P 
**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` options | [IWithModelQueryOptions](interfaces/iwithmodelqueryoptions.md) & `P` |

**Returns:** `ComponentEnhancer`<`P` & [IWithModelQueryMappedProps](interfaces/iwithmodelquerymappedprops.md), `P` & [IWithModelQueryProps](interfaces/iwithmodelqueryprops.md)>

___
<a id="withnewmodel"></a>

###  withNewModel

▸ **withNewModel**<`P`>(options?: *[IWithModelProps](interfaces/iwithmodelprops.md)*): `ComponentEnhancer`<`P`, `P`>

*Defined in [WithNewModel.tsx:15](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/WithNewModel.tsx#L15)*

An HOC which returns a new unsaved model if one is not provided.

**Type parameters:**

#### P 
**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` options | [IWithModelProps](interfaces/iwithmodelprops.md) |

**Returns:** `ComponentEnhancer`<`P`, `P`>

___

## Object literals

<a id="configuration"></a>

### `<Let>` configuration

**configuration**: *`object`*

*Defined in [Configure.ts:7](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Configure.ts#L7)*

<a id="configuration.loadingcomponent"></a>

####  loadingComponent

**● loadingComponent**: *[DefaultLoadingComponent]()* =  DefaultLoadingComponent

*Defined in [Configure.ts:8](https://github.com/Rediker-Software/redux-data-service-react/blob/8909226/src/Configure.ts#L8)*

___

___

