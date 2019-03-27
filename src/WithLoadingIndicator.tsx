import * as React from "react";
import { branch, ComponentEnhancer, compose, defaultProps, renderComponent, withPropsOnChange } from "recompose";

import { getConfiguration } from "./Configure";
import { omitProps } from "./Helpers";

export interface IWithLoadingIndicatorProps {
  isLoading?: boolean | ((props: any) => boolean);
  loadingComponent?: React.ComponentType<any>;
  loadingComponentProps?: any;
}

/**
 * Displays a loading component if the given test function returns true.
 *
 * The default test function returns true if a prop `isLoading` is set to `true`,
 * or if the `isLoading` prop is a `function` and it returns `true` when given the props.
 *
 * If no loading component is provided either statically or as a prop,
 * it will use the loading component specified in the configuration.
 */
export function withLoadingIndicator<P = IWithLoadingIndicatorProps>(options: IWithLoadingIndicatorProps = {}): ComponentEnhancer<P, P> {
  return compose<P, P>(
    defaultProps(options),
    withPropsOnChange([ "loadingComponent", "loadingComponentProps" ], ({ loadingComponent, loadingComponentProps }) => ({
      loadingComponent: loadingComponent || getConfiguration().loadingComponent,
      loadingComponentProps: loadingComponentProps || {}
    })),
    branch<P & IWithLoadingIndicatorProps>(
      ({ isLoading, ...props }) => (
        typeof isLoading === "function"
          ? isLoading(props)
          : isLoading
      ),
      renderComponent<IWithLoadingIndicatorProps>(({
          loadingComponent: Loading,
          loadingComponentProps,
          ...props
        }) => <Loading {...loadingComponentProps} {...props} />
      ),
    ),
    omitProps(["isLoading", "loadingComponent", "loadingComponentProps"]),
  );
}
