import React from "react";
import { Grid, Paper, Table, TableRow, TableCell, TableHead, TableBody } from "@material-ui/core";

/** A custom "CombinationRenderer" for react-storybook-addon-props-combinations addon */
export const CombinationRenderer = ({ Component, props }) => {
  const propNames = Object
    .keys(props)
    .filter((key) => key !== "children" && typeof props[key] !== "function");

  return (
    <Grid container spacing={40} alignItems="center" justify="space-between">
      <Grid item>
        <Component {...props} />
      </Grid>
      <Grid item>
        <Paper>
          <Table padding="dense">
            <TableHead>
              <TableRow>
                {propNames.map((propName, index) => (
                  <TableCell padding="dense" key={index}>{propName}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {propNames.map((propName, index) => (
                  <TableCell padding="dense" key={index}>{String(props[propName])}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}
