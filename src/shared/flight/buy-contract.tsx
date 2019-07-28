import React, { PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";

type PathParamsType = {
  contractaddress: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class BuyContractInner extends PureComponent<Props> {
  public render(): JSX.Element {
    /*const {
      match: {
        params: { contractaddress }
      }
    } = this.props;*/

    const obj = JSON.stringify({
      status: true
    });

    return <code>{obj}</code>;
  }
}

export const BuyContract = withRouter(BuyContractInner);
