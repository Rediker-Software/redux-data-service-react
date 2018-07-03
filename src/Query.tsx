import * as React from "react";
import { withRenderProps } from "recompose";

import { IWithModelQueryOptions, withModelQuery } from "./WithModelQuery";

export interface IQueryProps extends IWithModelQueryOptions {
  modelName: string;

  [key: string]: any;
}

export const Query = withRenderProps<IQueryProps>(withModelQuery());
