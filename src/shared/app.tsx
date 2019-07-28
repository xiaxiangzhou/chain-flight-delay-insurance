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

/*export class App extends Component<Props> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/address/:address"
          component={AddressDetails}
        />
        <Route path="/block/:height" component={BlockDetail} />
        <Route exact path="/block" component={Blocks} />
        <Route exact path="/action/:hash" component={ActionDetail} />
        <Route exact path="/action" component={Actions} />
        <Route exact path="/flightdetail" component={FlightDetail} />
        <Route path="/wallet" component={Wallet} />
      </Switch>
    );
  }
}*/

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
