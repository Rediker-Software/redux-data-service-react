/// <reference path="../node_modules/@types/recompose/index.d.ts" />
/// <reference path="../types/recompose.d.ts" />
/// <reference types="recompose" />
import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
export interface IWithModelQueryProps {
    query?: any;
    items?: any[];
}
export interface IWithModelQueryOptions extends IWithModelQueryProps {
    modelName?: string;
}
export declare function withModelQuery<P = {}>(options?: IWithModelQueryOptions | P): 'recompose'.ComponentEnhancer<P & {
    items: any[];
}, P>;
