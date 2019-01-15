import * as React from "react";
import { branch, compose, defaultProps, ComponentEnhancer, renderComponent, mapProps } from "recompose";

import { getConfiguration } from "./Configure";

export interface IShowLoadingIndicator<P> {
  (props: P): boolean;
}

export interface IWithLoadingIndicatorProps {
  isLoading?: boolean;
  loadingComponent?: React.ComponentType<any>;
  loadingComponentProps?: object;
}

export const defaultShowLoadingIndicator = ({ isLoading }: IWithLoadingIndicatorProps): boolean => isLoading;

/**
 * Displays a loading component if the given test function returns true.
 *
 * The default test function returns true if a prop `isLoading` is set to true.
 *
 * If no loading component is provided either statically or as a prop,
 * it will use the loading component specified in the configuration.
 */
export function withLoadingIndicator<P = IWithLoadingIndicatorProps>(
  test: IShowLoadingIndicator<P | any> = defaultShowLoadingIndicator,
  loadingComponent?: React.ComponentType<any>,
): ComponentEnhancer<P, P> {
  return compose<P, P>(
    defaultProps({
      loadingComponent: loadingComponent || getConfiguration().loadingComponent,
      loadingComponentProps: {},
    }),
    branch<P>(
      test,
      renderComponent<IWithLoadingIndicatorProps>(({ loadingComponent: Loading, loadingComponentProps }) => <Loading {...loadingComponentProps}/>),
    ),
    mapProps(({ isLoading, loadingComponent: Loading, loadingComponentProps, ...props }) => props),
  );
}
