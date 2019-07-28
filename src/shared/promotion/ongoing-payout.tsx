import React, { PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";

type PathParamsType = {};

type Props = RouteComponentProps<PathParamsType> & {};

class OngoingPayoutInner extends PureComponent<Props> {
  public render(): JSX.Element {
    const obj = JSON.stringify({
      payouts: [
        {
          buyerAddress: "xxxxxxxxxxx1",
          contractAddress: "yyyyyyyyyyy1",
          airLineCode: "UA",
          flightNumber: 312,
          scheduleTakeoff: 1564145593,
          pay: 250
        },
        {
          buyerAddress: "xxxxxxxxxxx2",
          contractAddress: "yyyyyyyyyyy2",
          airLineCode: "AA",
          flightNumber: 234,
          scheduleTakeoff: 1564135593,
          pay: 200
        },
        {
          buyerAddress: "xxxxxxxxxxx3",
          contractAddress: "yyyyyyyyyyy3",
          airLineCode: "DL",
          flightNumber: 1312,
          scheduleTakeoff: 1554145593,
          pay: 400
        },
        {
          buyerAddress: "xxxxxxxxxxx4",
          contractAddress: "yyyyyyyyyyy4",
          airLineCode: "AA",
          flightNumber: 789,
          scheduleTakeoff: 1564143593,
          pay: 198
        }
      ]
    });

    return <code>{obj}</code>;
  }
}

export const OngoingPayout = withRouter(OngoingPayoutInner);
