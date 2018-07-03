export interface IConfiguration {
  loadingComponent: React.ComponentType<any>;
}

let configuration: IConfiguration = {} as IConfiguration;

export function getConfiguration() {
  return configuration;
}

export function configure(config: IConfiguration, configureStore): void {
  configuration = config;
}
