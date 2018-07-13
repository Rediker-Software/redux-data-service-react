import { DefaultLoadingComponent } from "./DefaultLoadingComponent";

export interface IConfiguration {
  loadingComponent?: React.ComponentType<any>;
}

let configuration: IConfiguration = {
  loadingComponent: DefaultLoadingComponent,
};

export function getConfiguration() {
  return configuration;
}

export function configure(config: IConfiguration): void {
  configuration = { ...config };

  if (configuration.loadingComponent == null) {
    configuration.loadingComponent = DefaultLoadingComponent;
  }
}
