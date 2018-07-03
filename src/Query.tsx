import * as React from "react";
import { withModelQuery } from "./index";
import { withRenderProps } from "recompose";
import { IWithModelQueryOptions } from "./WithModelQuery";

export interface IQueryProps extends IWithModelQueryOptions {
  modelName: string;

  [key: string]: any;
}

export const Query = withRenderProps<IQueryProps>(withModelQuery());
