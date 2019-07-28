import React, { PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";

type PathParamsType = {};

type Props = RouteComponentProps<PathParamsType> & {};

class PolicyInner extends PureComponent<Props> {
  public render(): JSX.Element {
    const obj = JSON.stringify({
      unknown: 0,
      ontime: 0,
      cancel: 50,
      devert: 0,
      delay0h: 0,
      delay1h: 0,
      delay2h: 0,
      delay3h: 0,
      delay4h: 100,
      delay5h: 100,
      delay6h: 100,
      delay7h: 100,
      delay8h: 100,
      delay9h: 100,
      delay10hplus: 100
    });

    return <code>{obj}</code>;
  }
}

export const Policy = withRouter(PolicyInner);
