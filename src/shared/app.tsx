// @ts-ignore

// @ts-ignore
import Footer, { FOOTER_HEIGHT } from "iotex-react-footer";
import React, { Component } from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import { BuyContract } from "./flight/buy-contract";
import { FlightDetail } from "./flight/flight-detail";
import { Policy } from "./policy/policy";
import { OngoingPayout } from "./promotion/ongoing-payout";
import { Recommand } from "./promotion/recommand";

type Props = {
  googleTid: string;
  locale: string;
};

export class App extends Component<Props> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route
          exact
          path="/flightdetail/:airlinecode/:flightnumber/:year/:month/:day"
          component={FlightDetail}
        />
        <Route exact path="/buy/:contractaddress" component={BuyContract} />
        <Route exact path="/recommand" component={Recommand} />
        <Route exact path="/ongoingpayout" component={OngoingPayout} />
        <Route exact path="/policy" component={Policy} />
      </Switch>
    );
  }
}
