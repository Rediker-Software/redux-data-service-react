/// <reference types="react" />
export interface IConfiguration {
    loadingComponent: React.ComponentType<any>;
}
export declare function getConfiguration(): IConfiguration;
export declare function configure(config: IConfiguration, configureStore: any): void;
