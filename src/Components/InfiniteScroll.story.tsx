import * as React from "react";
import { fakeModelModule, initializeTestServices, seedServiceList } from "redux-data-service";

import { storiesOf } from "@storybook/react";

import { InfiniteScroll } from "./InfiniteScroll";

const InfiniteScrollStoryContainer = (props) => {
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

interface IInfiniteScrollStoryContainerItemProps {
  model: any;
}

const InfiniteScrollStoryContainerItem = ({ model }: IInfiniteScrollStoryContainerItemProps) => {
  const style = {
    height: model.id % 100 + 50,
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

    seedServiceList<any>("fakeModel", 25, { fullText: "page 1" }, { queryParams: { page: 1 }, hasNext: true, nextPage: 2, hasPrevious: false });
    seedServiceList<any>("fakeModel", 25, { fullText: "page 10" }, { queryParams: { page: 10 }, hasNext: false, hasPrevious: true, previousPage: 9 });

    for (let i = 2; i < 10; i++) {
      seedServiceList<any>(
        "fakeModel",
        25,
        { fullText: `page ${i}` },
        { queryParams: { page: i }, hasNext: true, nextPage: i + 1, hasPrevious: true, previousPage: i - 1 },
      );
    }

    return story();
  })
  .add("With Variable Heights", () => (
    <InfiniteScroll
      containerComponent={InfiniteScrollStoryContainer}
      modelComponent={InfiniteScrollStoryContainerItem}
      modelName="fakeModel"
      query={{ page: 1 }}
    />
  ));
