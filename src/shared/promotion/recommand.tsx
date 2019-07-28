import React, { PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";

type PathParamsType = {};

type Props = RouteComponentProps<PathParamsType> & {};

class RecommandInner extends PureComponent<Props> {
  public render(): JSX.Element {
    const obj = JSON.stringify({
      recommands: [
        {
          airLineCode: "UA",
          flightNumber: 912,
          premium: 10,
          maxBenefit: 250
        },
        {
          airLineCode: "UA",
          flightNumber: 1231,
          premium: 10,
          maxBenefit: 200
        },
        {
          airLineCode: "AA",
          flightNumber: 5983,
          premium: 10,
          maxBenefit: 300
        },
        {
          airLineCode: "DL",
          flightNumber: 773,
          premium: 10,
          maxBenefit: 200
        }
      ]
    });

    return <code>{obj}</code>;
  }
}

export const Recommand = withRouter(RecommandInner);
