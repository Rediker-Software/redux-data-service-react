import * as React from "react";
import { withRenderProps } from "recompose";

import { IWithModelProps, withModel } from "./WithModel";

export interface IModelProps extends IWithModelProps {
  [key: string]: any;
}

export const Model = withRenderProps<IModelProps>(withModel());
