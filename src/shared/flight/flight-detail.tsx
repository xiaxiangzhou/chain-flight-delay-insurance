import React, { PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";

type PathParamsType = {
  airlinecode: string;
  flightnumber: string;
  year: string;
  month: string;
  day: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class FlightDetailInner extends PureComponent<Props> {
  public render(): JSX.Element {
    /*const {
      match: {
        params: { airlinecode, flightnumber, year, month, day }
      }
    } = this.props;*/

    const obj = JSON.stringify({
      orders: [
        {
          maxBenefit: 250,
          creatorAddress: "xxxxxxx1",
          contractAddress: "yyyyyyy1"
        },
        {
          maxBenefit: 200,
          creatorAddress: "xxxxxxx2",
          contractAddress: "yyyyyyy2"
        },
        {
          maxBenefit: 200,
          creatorAddress: "xxxxxxx3",
          contractAddress: "yyyyyyy3"
        },
        {
          maxBenefit: 150,
          creatorAddress: "xxxxxxx4",
          contractAddress: "yyyyyyy4"
        }
      ]
    });

    return <code>{obj}</code>;
  }
}

export const FlightDetail = withRouter(FlightDetailInner);
