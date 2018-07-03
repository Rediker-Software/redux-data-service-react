
declare module "recompose" {
  import * as React from "react";
  import { ComponentEnhancer } from "recompose";

  export function withRenderProps<TProps>(
    hoc: ComponentEnhancer<TProps, TProps>,
  ): React.ComponentType<TProps>;
}
