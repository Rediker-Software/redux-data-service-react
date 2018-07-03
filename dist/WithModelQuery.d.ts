/// <reference path="../node_modules/@types/recompose/index.d.ts" />
/// <reference path="../types/recompose.d.ts" />
/// <reference types="recompose" />
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/combineLatest";
export interface IWithModelQueryOptions {
    modelName?: string;
    query?: any;
    items?: any;
    isLoading?: boolean;
}
export declare function withModelQuery<P = {}>(options?: IWithModelQueryOptions | P): 'recompose'.ComponentEnhancer<P, P>;
