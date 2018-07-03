import * as React from "react";

export interface IFakeComponentProps {
  fakeProp?: any;
}

export class FakeComponent extends React.Component<IFakeComponentProps> {
  public render() {
    return (<span />);
  }
}
