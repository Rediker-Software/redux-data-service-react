import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import { ComponentEnhancer } from "recompose";
import { IWithLoadingIndicatorProps } from "./WithLoadingIndicator";
export interface IWithModelQueryProps {
    query?: any;
    items?: any[];
}
export interface IWithModelQueryOptions extends IWithModelQueryProps, IWithLoadingIndicatorProps {
    modelName?: string;
}
export declare function withModelQuery<P = {}>(options?: IWithModelQueryOptions & P): ComponentEnhancer<P, P>;
