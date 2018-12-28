import * as React from "react";
import { storiesOf } from "@storybook/react";
import { setDisplayName, compose } from "recompose";
import modules from "Modules";

import { InfiniteScroll } from "./InfiniteScroll";
import { withStyle } from "Style";
import { seedServiceList, initializeTestServices } from "redux-data-service";
import { Grid, Typography, Spacer } from "./Layout";
import { Paper, } from "@material-ui/core";
import { PersonAvatar, PersonNameDisplay } from "Modules/Person";
import { BirthDateDisplay } from "./Form";

const InfiniteScrollStoryContainer = compose<{}, {}>(
  setDisplayName("InfiniteScrollStoryContainer"),
  withStyle({
    height: 500,
    width: 500,
    border: "solid 1px black",
    backgroundColor: "white !important",
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
  withStyle({
    padding: ({ theme }) => [theme.spacing.unit * 4, "!important"],
    borderBottomColor: ({ theme }) => [theme.palette.slate.light, "!important"],
    borderBottom: {
      style: "solid",
      width: 1
    },
  }),
)(({ children, item, ...props }) => (
  <Spacer {...props}>
    <Grid container spacing={16}>
      <Grid item>
        <PersonAvatar person={item} size={32} />
      </Grid>
      <Grid container item xs spacing={8}>
        <Grid item xs={12}>
          <PersonNameDisplay person={item} />
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Born <BirthDateDisplay value={item.dateBirth} />
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  </Spacer>
));

storiesOf("InfiniteScroll", module)
  .addDecorator((story) => {
    initializeTestServices(modules);
    for ( let i = 1; i < 10; i++ ) {
      seedServiceList<any>("person", 10, { organizationId: "1", pageNumber: i });
    }

    return story();
  })
  .add("With Scrollable Grid Example", () => (
    <InfiniteScroll
      containerComponent={InfiniteScrollStoryContainer}
      itemComponent={InfiniteScrollStoryContainerItem}
      serviceName="person"
      queryParams={{ pageNumber: 1 }}
    />
  ))
  ;
