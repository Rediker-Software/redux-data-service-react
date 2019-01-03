import * as React from "react";
import { storiesOf } from "@storybook/react";
import { setDisplayName, compose } from "recompose";
import { seedServiceList, initializeTestServices, fakeModelModule } from "redux-data-service";
import { Grid, Typography, Paper, withStyles } from "@material-ui/core";

import { InfiniteScroll } from "./InfiniteScroll";

const InfiniteScrollStoryContainer = compose<{}, {}>(
  setDisplayName("InfiniteScrollStoryContainer"),
  withStyles({
    root: {
      height: 500,
      width: 500,
      border: "solid 1px black",
      backgroundColor: "white !important",
      overflow: "auto",
    },
  }),
)(({ children, ...props }) => (
  <Paper {...props}>
      {children}
  </Paper>
));

interface IInfiniteScrollStoryContainerItemProps {
  item: any;
}

const InfiniteScrollStoryContainerItem = compose<IInfiniteScrollStoryContainerItemProps, IInfiniteScrollStoryContainerItemProps>(
  setDisplayName("InfiniteScrollStoryContainerItem"),
  withStyles({
    container: {
      padding: "25px",
      borderBottomColor: "grey",
      borderBottom: "solid",
    },
  }),
)(({ children, item, ...props }) => (
    <Grid container spacing={16}>
      <Grid container item xs spacing={8}>
        <Grid item xs={12}>
        ID: {item.id}
        </Grid>
        <Grid item xs={12}>
          <Typography>
          Title: {item.fullText}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
));

storiesOf("InfiniteScroll", module)
  .addDecorator((story) => {
    initializeTestServices(fakeModelModule);

    seedServiceList<any>("fakeModel", 20, { fullText: "page 1" }, { queryParams: { page: 1 }, hasNext: true, nextPage: 2, hasPrevious: false });
    seedServiceList<any>("fakeModel", 20, { fullText: "page 10" }, { queryParams: { page: 10 }, hasNext: false, hasPrevious: true, previousPage: 9 });

    for (let i = 2; i < 10; i++) {
      seedServiceList<any>("fakeModel", 20, { fullText: `page ${i}` }, { queryParams: { page: i }, hasNext: true, nextPage: i + 1, hasPrevious: true, previousPage: i - 1 });
    }

    return story();
  })
  .add("With Scrollable Grid Example", () => (
    <InfiniteScroll
      containerComponent={InfiniteScrollStoryContainer}
      itemComponent={InfiniteScrollStoryContainerItem}
      modelName="fakeModel"
      query={{ page: 1 }}
    />
  ));
