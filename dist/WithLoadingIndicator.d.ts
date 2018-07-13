import * as React from "react";
import { ComponentEnhancer } from "recompose";
export interface IShowLoadingIndicator<P> {
    (props: P): boolean;
}
export interface IWithLoadingIndicatorProps {
    isLoading?: boolean;
    loadingComponent?: React.ComponentType;
}
export declare const defaultShowLoadingIndicator: ({ isLoading }: IWithLoadingIndicatorProps) => boolean;
export declare function withLoadingIndicator<P = IWithLoadingIndicatorProps>(test?: IShowLoadingIndicator<P | any>, loadingComponent?: React.ComponentType<any>): ComponentEnhancer<P, P>;
