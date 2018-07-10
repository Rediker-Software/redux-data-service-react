import * as React from "react";
import {branch, ComponentEnhancer, renderComponent} from "recompose";

import {getConfiguration} from "./Configure";

export interface IShowLoadingIndicator<P> {
  (props: P): boolean;
}

export interface IDefaultLoadingProps {
  isLoading?: boolean;
}

export const defaultShowLoadingIndicator = ({isLoading}: IDefaultLoadingProps): boolean => isLoading;

export function withLoadingIndicator<P = IDefaultLoadingProps>(
  test: IShowLoadingIndicator<P | any> = defaultShowLoadingIndicator,
  loadingComponent?: React.ComponentType<any>,
): ComponentEnhancer<P, P> {
  return (
    branch<P>(
      test,
      renderComponent(loadingComponent || getConfiguration().loadingComponent || "Loading..."),
    )
  );
}
