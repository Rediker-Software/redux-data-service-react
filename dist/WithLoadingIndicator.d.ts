/// <reference path="../node_modules/@types/recompose/index.d.ts" />
/// <reference path="../types/recompose.d.ts" />
/// <reference types="recompose" />
import * as React from "react";
export interface IShowLoadingIndicator<P> {
    (props: P): boolean;
}
export interface IDefaultLoadingProps {
    isLoading?: boolean;
}
export declare const defaultShowLoadingIndicator: ({ isLoading }: IDefaultLoadingProps) => boolean;
export declare function withLoadingIndicator<P = IDefaultLoadingProps>(test?: IShowLoadingIndicator<P | any>, loadingComponent?: React.ComponentType<any>): 'recompose'.ComponentEnhancer<any, P>;
