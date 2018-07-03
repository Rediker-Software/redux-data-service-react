import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/combineLatest";
import { ComponentEnhancer } from "recompose";
export declare function withModelArray<P>(dataServiceName: string, idPropKey?: string, modelPropKey?: string): ComponentEnhancer<P, P>;
