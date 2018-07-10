import * as React from "react";
import { ComponentEnhancer } from "recompose";
export interface IShowLoadingIndicator<P> {
    (props: P): boolean;
}
export interface IDefaultLoadingProps {
    isLoading?: boolean;
}
export declare const defaultShowLoadingIndicator: ({ isLoading }: IDefaultLoadingProps) => boolean;
export declare function withLoadingIndicator<P = IDefaultLoadingProps>(test?: IShowLoadingIndicator<P | any>, loadingComponent?: React.ComponentType<any>): ComponentEnhancer<P, P>;
