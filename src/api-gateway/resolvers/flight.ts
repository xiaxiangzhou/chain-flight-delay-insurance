// tslint:disable:no-any
import {
  Args,
  ArgsType,
  Query,
  registerEnumType,
  Resolver,
  ResolverInterface
} from "type-graphql";
import { Field, ObjectType } from "type-graphql";

const SUPPORTED_AIRLINE_CODE = [
  "AS",
  "G4",
  "AA",
  "DL",
  "F9",
  "HA",
  "B6",
  "WN",
  "NK",
  "SY",
  "UA"
];

export enum StatusCode {
  Success,
  Unavailable
}

export enum FlightOrderStatusCode {
  Normal,
  NotSupported,
  NoOrder
}

registerEnumType(StatusCode, {
  name: "StatusCode"
});

@ObjectType()
export class Order {
  @Field(_ => Number)
  public maxBenefit: number;

  @Field(_ => String)
  public creatorAddress: string;

  @Field(_ => String)
  public contractAddress: string;
}

@ObjectType()
export class FlightDetail {
  @Field(_ => Number)
  public flightOrderStatusCode: number;

  @Field(_ => String)
  public flightOrderStatusMessage: string;

  @Field(_ => [Order], { nullable: true })
  public orders: Array<Order>;
}

@ObjectType()
export class FlightDetailResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => FlightDetail)
  public result: FlightDetail;
}

@ObjectType()
export class Policy {
  @Field(_ => Number)
  public premium: number;

  @Field(_ => Number)
  public traditionalMaxBenefit: number;

  @Field(_ => Number)
  public unknown: number;

  @Field(_ => Number)
  public ontime: number;

  @Field(_ => Number)
  public cancel: number;

  @Field(_ => Number)
  public divert: number;

  @Field(_ => Number)
  public delay0h: number;

  @Field(_ => Number)
  public delay1h: number;

  @Field(_ => Number)
  public delay2h: number;

  @Field(_ => Number)
  public delay3h: number;

  @Field(_ => Number)
  public delay4h: number;

  @Field(_ => Number)
  public delay5h: number;

  @Field(_ => Number)
  public delay6h: number;

  @Field(_ => Number)
  public delay7h: number;

  @Field(_ => Number)
  public delay8h: number;

  @Field(_ => Number)
  public delay9h: number;

  @Field(_ => Number)
  public delay10hplus: number;
}

@ObjectType()
export class PolicyResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => Policy)
  public result: Policy;
}

@ObjectType()
export class Recommand {
  @Field(_ => String)
  public airLineCode: string;

  @Field(_ => Number)
  public flightNumber: number;

  @Field(_ => Number)
  public premium: number;

  @Field(_ => Number)
  public maxBenefit: number;
}

@ObjectType()
export class Recommands {
  @Field(_ => [Recommand], { nullable: true })
  public recommands: Array<Recommand>;
}

@ObjectType()
export class RecommandResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => Recommands)
  public result: Recommands;
}

@ObjectType()
export class OngoingPayout {
  @Field(_ => String)
  public buyerAddress: string;

  @Field(_ => String)
  public contractAddress: string;

  @Field(_ => String)
  public airlineCode: string;

  @Field(_ => Number)
  public flightNumber: number;

  @Field(_ => Number)
  public scheduleTakeOff: number;

  @Field(_ => Number)
  public payTime: number;

  @Field(_ => Number)
  public pay: number;
}

@ObjectType()
export class OngoingPayouts {
  @Field(_ => [OngoingPayout], { nullable: true })
  public payouts: Array<OngoingPayout>;
}

@ObjectType()
export class OngoingPayoutResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => OngoingPayouts)
  public result: OngoingPayouts;
}

@ObjectType()
export class Flight {
  @Field(_ => String)
  public airlineCode: string;

  @Field(_ => Number)
  public flightNumber: number;

  @Field(_ => String)
  public srcAirport: string;

  @Field(_ => String)
  public dstAirport: string;
}

@ObjectType()
export class SupportedFlights {
  @Field(_ => [Flight], { nullable: true })
  public flights: Array<Flight>;
}

@ObjectType()
export class SupportedFlightsResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => SupportedFlights)
  public result: SupportedFlights;
}

@ObjectType()
export class AvailableOrders {
  @Field(_ => String)
  public date: string;

  @Field(_ => Number)
  public orderNumber: number;
}

@ObjectType()
export class AvailableOrdersList {
  @Field(_ => [AvailableOrders], { nullable: true })
  public availableOrdersList: Array<AvailableOrders>;
}

@ObjectType()
export class AvailableOrdersResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => AvailableOrdersList)
  public result: AvailableOrdersList;
}

@ArgsType()
export class FlightDetailRequest {
  @Field(_ => String)
  public airlineCode: string;

  @Field(_ => Number)
  public flightNumber: number;

  @Field(_ => Number)
  public year: number;

  @Field(_ => Number)
  public month: number;

  @Field(_ => Number)
  public day: number;
}

@ArgsType()
export class AvailableOrdersRequest {
  @Field(_ => String)
  public airlineCode: string;

  @Field(_ => Number)
  public flightNumber: number;
}

@Resolver(_ => String)
export class FlightsResolver implements ResolverInterface<() => String> {
  @Query(_ => String)
  public async health(): Promise<string> {
    return "OK";
  }

  @Query(_ => FlightDetailResponse, { description: "read flight detail" })
  public async getFlightDetail(
    @Args(_ => FlightDetailRequest)
    input: FlightDetailRequest
  ): Promise<FlightDetailResponse> {
    // un supported flight
    if (!SUPPORTED_AIRLINE_CODE.includes(input.airlineCode)) {
      const detail = new FlightDetail();
      detail.flightOrderStatusCode = FlightOrderStatusCode.NotSupported.valueOf();
      detail.flightOrderStatusMessage = "Do Not Support This Flight";
      detail.orders = [];

      const response = new FlightDetailResponse();
      response.code = StatusCode.Success.valueOf();
      response.message = "";
      response.result = detail;

      return response;
    }

    // no order
    if (![912, 883].includes(input.flightNumber)) {
      const detail = new FlightDetail();
      detail.flightOrderStatusCode = FlightOrderStatusCode.NoOrder.valueOf();
      detail.flightOrderStatusMessage = "No Order In This Flight";
      detail.orders = [];

      const response = new FlightDetailResponse();
      response.code = StatusCode.Success.valueOf();
      response.message = "";
      response.result = detail;

      return response;
    }

    const detail = new FlightDetail();
    const order1 = new Order();
    order1.contractAddress = "yyyyyyy1";
    order1.creatorAddress = "xxxxxxx1";
    order1.maxBenefit = 250;

    const order2 = new Order();
    order2.contractAddress = "yyyyyyy2";
    order2.creatorAddress = "xxxxxxx2";
    order2.maxBenefit = 200;

    const order3 = new Order();
    order3.contractAddress = "yyyyyyy3";
    order3.creatorAddress = "xxxxxxx3";
    order3.maxBenefit = 150;

    const order4 = new Order();
    order4.contractAddress = "yyyyyyy4";
    order4.creatorAddress = "xxxxxxx4";
    order4.maxBenefit = 300;
    detail.orders = [order1, order2, order3, order4];
    detail.flightOrderStatusCode = FlightOrderStatusCode.Normal.valueOf();
    detail.flightOrderStatusMessage = "";

    const response = new FlightDetailResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";
    response.result = detail;

    return response;
  }

  @Query(_ => AvailableOrdersResponse, {
    description: "read available flight orders"
  })
  public async getAvailableOrders(
    @Args(_ => AvailableOrdersRequest)
    _: AvailableOrdersRequest
  ): Promise<AvailableOrdersResponse> {
    // un supported flight
    let availableOrdersList = new AvailableOrdersList();
    const availableOrder1 = new AvailableOrders();
    availableOrder1.date = "2019-08-22";
    availableOrder1.orderNumber = 4;

    const availableOrder2 = new AvailableOrders();
    availableOrder2.date = "2019-08-23";
    availableOrder2.orderNumber = 4;

    const availableOrder3 = new AvailableOrders();
    availableOrder3.date = "2019-08-24";
    availableOrder3.orderNumber = 4;

    const availableOrder4 = new AvailableOrders();
    availableOrder4.date = "2019-08-25";
    availableOrder4.orderNumber = 4;

    availableOrdersList.availableOrdersList = [
      availableOrder1,
      availableOrder2,
      availableOrder3,
      availableOrder4
    ];

    const response = new AvailableOrdersResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";
    response.result = availableOrdersList;

    return response;
  }

  @Query(_ => PolicyResponse, { description: "read policy" })
  public async getPolicy(): Promise<PolicyResponse> {
    //return gateways.antenna.readContract(input);

    const policy = new Policy();
    policy.premium = 5;
    policy.traditionalMaxBenefit = 50;
    policy.unknown = 0;
    policy.ontime = 0;
    policy.cancel = 50;
    policy.divert = 0;
    policy.delay0h = 0;
    policy.delay1h = 0;
    policy.delay2h = 0;
    policy.delay3h = 0;
    policy.delay4h = 100;
    policy.delay5h = 100;
    policy.delay6h = 100;
    policy.delay7h = 100;
    policy.delay8h = 100;
    policy.delay9h = 100;
    policy.delay10hplus = 100;

    const response = new PolicyResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";
    response.result = policy;

    return response;
  }

  @Query(_ => RecommandResponse, { description: "recommand some flights" })
  public async getRecommandation(): Promise<RecommandResponse> {
    //return gateways.antenna.readContract(input);

    const response = new RecommandResponse();
    const recommand1 = new Recommand();
    recommand1.airLineCode = "UA";
    recommand1.flightNumber = 912;
    recommand1.premium = 10;
    recommand1.maxBenefit = 250;

    const recommand2 = new Recommand();
    recommand2.airLineCode = "UA";
    recommand2.flightNumber = 1231;
    recommand2.premium = 10;
    recommand2.maxBenefit = 200;

    const recommand3 = new Recommand();
    recommand3.airLineCode = "AA";
    recommand3.flightNumber = 5983;
    recommand3.premium = 10;
    recommand3.maxBenefit = 300;

    const recommand4 = new Recommand();
    recommand4.airLineCode = "DL";
    recommand4.flightNumber = 773;
    recommand4.premium = 10;
    recommand4.maxBenefit = 200;

    const recommands = new Recommands();
    recommands.recommands = [recommand1, recommand2, recommand3, recommand4];

    response.code = StatusCode.Success.valueOf();
    response.message = "";
    response.result = recommands;

    return response;
  }

  @Query(_ => OngoingPayoutResponse, { description: "ongoing payouts" })
  public async getOngoingPayouts(): Promise<OngoingPayoutResponse> {
    //return gateways.antenna.readContract(input);

    const response = new OngoingPayoutResponse();
    const payout1 = new OngoingPayout();
    payout1.buyerAddress = "xxxxxxxxxxx1";
    payout1.contractAddress = "yyyyyyyyyyy1";
    payout1.airlineCode = "UA";
    payout1.flightNumber = 312;
    payout1.scheduleTakeOff = 1564145593;
    payout1.payTime = 1564385593;
    payout1.pay = 250;

    const payout2 = new OngoingPayout();
    payout2.buyerAddress = "xxxxxxxxxxx2";
    payout2.contractAddress = "yyyyyyyyyyy2";
    payout2.airlineCode = "AA";
    payout2.flightNumber = 234;
    payout2.scheduleTakeOff = 1564135593;
    payout2.payTime = 1564375593;
    payout2.pay = 200;

    const payout3 = new OngoingPayout();
    payout3.buyerAddress = "xxxxxxxxxxx3";
    payout3.contractAddress = "yyyyyyyyyyy3";
    payout3.airlineCode = "DL";
    payout3.flightNumber = 1312;
    payout3.scheduleTakeOff = 1554145593;
    payout3.payTime = 1554385593;
    payout3.pay = 400;

    const payout4 = new OngoingPayout();
    payout4.buyerAddress = "xxxxxxxxxxx4";
    payout4.contractAddress = "yyyyyyyyyyy4";
    payout4.airlineCode = "AA";
    payout4.flightNumber = 789;
    payout4.scheduleTakeOff = 1564143593;
    payout4.payTime = 1564383593;
    payout4.pay = 198;

    const payouts = new OngoingPayouts();
    payouts.payouts = [payout1, payout2, payout3, payout4];

    response.code = StatusCode.Success.valueOf();
    response.message = "";
    response.result = payouts;

    return response;
  }

  @Query(_ => SupportedFlightsResponse, {
    description: "read supported flights"
  })
  public async getSupportedFlights(): Promise<SupportedFlightsResponse> {
    let supportedFlights = new SupportedFlights();

    let flight1 = new Flight();
    flight1.airlineCode = "AS";
    flight1.flightNumber = 340;
    flight1.srcAirport = "SFO";
    flight1.dstAirport = "EWR";

    let flight2 = new Flight();
    flight2.airlineCode = "B6";
    flight2.flightNumber = 616;
    flight2.srcAirport = "SFO";
    flight2.dstAirport = "JFK";

    let flight3 = new Flight();
    flight3.airlineCode = "DL";
    flight3.flightNumber = 430;
    flight3.srcAirport = "SFO";
    flight3.dstAirport = "JFK";

    let flight4 = new Flight();
    flight4.airlineCode = "UA";
    flight4.flightNumber = 1796;
    flight4.srcAirport = "SFO";
    flight4.dstAirport = "EWR";
    supportedFlights.flights = [flight1, flight2, flight3, flight4];

    let response = new SupportedFlightsResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";
    response.result = supportedFlights;

    return response;
  }
}
