import * as React from "react";
import { fakeModelModule, initializeTestServices } from "redux-data-service";

import { storiesOf } from "@storybook/react";

import { InfiniteScroll } from "./InfiniteScroll";

import { seedServiceListWithPagingOptions } from "../TestUtils";

const Container = (props) => {
  const style = {
    height: 500,
    width: 500,
    border: "solid 1px black",
    backgroundColor: "white !important",
    overflow: "auto",
  };

  return (
    <div style={style} {...props}>
      {props.children}
    </div>
  );
};

interface IContainerModelProps {
  model: any;
  uniformHeights?: boolean;
}

const ContainerModel = ({ model, uniformHeights }: IContainerModelProps) => {
  const style = {
    height: uniformHeights ? 50 : model.id % 100 + 50,
    padding: "25px",
    borderBottom: "solid 1px #999",
  };

  return (
    <div style={style}>
      <p>ID: {model.id}</p>
      <p>Title: {model.fullText}</p>
    </div>
  );
};

storiesOf("InfiniteScroll", module)
  .addDecorator((story) => {
    initializeTestServices(fakeModelModule);
    seedServiceListWithPagingOptions("fakeModel", 25, 50);
    return story();
  })
  .add("Infinite Scrolling Uniform Heights", () => (
    <InfiniteScroll
      containerComponent={Container}
      disableVirtualScrolling
      modelComponent={ContainerModel}
      modelComponentProps={{ uniformHeights: true }}
      modelName="fakeModel"
      query={{ page: 1 }}
    />
  ))
  .add("Infinite Scrolling Variable Heights", () => (
    <InfiniteScroll
      containerComponent={Container}
      disableVirtualScrolling
      modelComponent={ContainerModel}
      modelName="fakeModel"
      query={{ page: 1 }}
    />
  ))
  .add("Virtual Scrolling Uniform Heights", () => (
    <InfiniteScroll
      containerComponent={Container}
      modelComponent={ContainerModel}
      modelComponentProps={{ uniformHeights: true }}
      modelName="fakeModel"
      query={{ page: 1 }}
    />
  ))
  .add("Virtual Scrolling Variable Heights", () => (
    <InfiniteScroll
      containerComponent={Container}
      modelComponent={ContainerModel}
      modelName="fakeModel"
      query={{ page: 1 }}
    />
  ));
