import * as React from "react";
import { IWithModelQueryOptions } from "./WithModelQuery";
export interface IQueryProps extends IWithModelQueryOptions {
    modelName: string;
    [key: string]: any;
}
export declare const Query: React.ComponentType<IQueryProps>;
