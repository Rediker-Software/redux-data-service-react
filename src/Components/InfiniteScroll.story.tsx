import * as React from "react";
import { fakeModelModule, initializeTestServices } from "redux-data-service";

import { storiesOf } from "@storybook/react";

import { InfiniteScroll } from "./InfiniteScroll";

import { seedServiceListWithPagingOptions } from "../TestUtils";

const containerStyle = {
  height: 500,
  width: 500,
  border: "solid 1px black",
  backgroundColor: "white !important",
  overflow: "auto",
  display: "block",
};

const Container = (props) => {
  return (
    <div style={containerStyle} {...props}>
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

const Table = ({ children, items, ...props }) => {
  return (
    <table style={containerStyle} {...props}>
      <tbody>{children}</tbody>
    </table>
  );
};

const TableRow = ({ model, ...props }) => {
  const style = {
    height: model.id % 100 + 50,
    padding: "25px",
    borderBottom: "solid 1px #999",
  };

  return (
    <tr style={style} {...props}>
      <td>ID: {model.id}</td>
      <td>Title: {model.fullText}</td>
    </tr>
  );
};

const TableContentPlaceHolder = ({ height }) => {
  const style = {
    height,
  };

  return (
    <tr style={style} />
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
      delayTimeout={5000}
    />
  ))
  .add("Virtual Scrolling Variable Heights", () => (
    <InfiniteScroll
      containerComponent={Container}
      modelComponent={ContainerModel}
      modelName="fakeModel"
      query={{ page: 1 }}
    />
  ))
  .add("Virtual Scrolling Table", () => (
    <InfiniteScroll
      containerComponent={Table}
      modelComponent={TableRow}
      contentPlaceHolderComponent={TableContentPlaceHolder}
      modelName="fakeModel"
      query={{ page: 1 }}
    />
  ))
;
