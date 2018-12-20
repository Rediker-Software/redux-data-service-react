import * as React from "react";
import { withRenderProps } from "recompose";

import { IWithModelProps } from "./WithModel";
import { withNewModel } from "./WithNewModel";

export interface INewModelProps extends IWithModelProps {
  [key: string]: any;
}

export const NewModel = withRenderProps<INewModelProps>(withNewModel());
