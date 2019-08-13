// tslint:disable:no-any
import {
  Args,
  ArgsType,
  Ctx,
  Query,
  registerEnumType,
  Resolver,
  ResolverInterface
} from "type-graphql";
import { Field, ObjectType } from "type-graphql";
import util from "util";
//import * as jwt from "jsonwebtoken";
import { Model } from "../../model";

export interface IContext {
  model: Model;
  headers: { [id: string]: string };
}

/*const SUPPORTED_AIRLINE_CODE = [
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
];*/

const WEI_TO_ETHER = 1000000000000000000;
export const SECRET_KEY =
  "88E33784A3CBA2D17820C6F3991839FA7ECD90BFFDE675E09C83E86344780A4E";

export enum StatusCode {
  Success,
  Unavailable,
  TokenExpired,
  InternalServerError
}

export enum FlightOrderStatusCode {
  Normal,
  NotSupported,
  NoOrder,
  DateError
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
    input: FlightDetailRequest,
    @Ctx() { model }: IContext
  ): Promise<FlightDetailResponse> {
    /*await model.order.upsertOrder(
      "AS",
      266,
      "2019-08-10",
      "",
      1565457330,
      "io1jhzav2m2zsz5kyehvmcuskus3unepputa223sy",
      "io19dvyeuwpc9lvjx6tu3ndepw3zuvsfdqj8jmk6v",
      "",
      "io19dvyeuwpc9lvjx6tu3ndepw3zuvsfdqj8jmk6v",
      "io19r8cj7pmpr8jdt85p5nh7jw5sw8yk5dd86k43t",
      0,
      10000000000000000000,
      5000000000000000000,
      new Object("5d4a1e92325c64d24c1fae49"),
      new Object("5d4a1e92325c64d24c1fae49"),
    );*/

    if (
      input.month < 0 ||
      input.month > 12 ||
      input.day < 0 ||
      input.day > 31
    ) {
      const detail = new FlightDetail();
      detail.flightOrderStatusCode = FlightOrderStatusCode.DateError.valueOf();
      detail.flightOrderStatusMessage = "Month or Day is not correct";
      detail.orders = [];

      const response = new FlightDetailResponse();
      response.code = StatusCode.Success.valueOf();
      response.message = "";
      response.result = detail;

      return response;
    }

    let month = "";
    if (input.month < 10) {
      month = util.format("0%d", input.month);
    } else {
      month = util.format("%d", input.month);
    }
    let day = "";
    if (input.day < 10) {
      day = util.format("0%d", input.day);
    } else {
      day = util.format("%d", input.day);
    }
    const date = util.format("%d-%s-%s", input.year, month, day);
    const rows = await model.order.getAvailableOrdersByFlightAndDate(
      input.airlineCode,
      input.flightNumber,
      date
    );

    // no order
    if (rows.length === 0) {
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
    detail.orders = [];
    for (const row of rows) {
      const order = new Order();
      order.contractAddress = row.contractAddress;
      order.creatorAddress = row.creatorAddress;
      order.maxBenefit = row.maxBenefit / WEI_TO_ETHER;
      detail.orders.push(order);
    }

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
    input: AvailableOrdersRequest,
    @Ctx() { model }: IContext
  ): Promise<AvailableOrdersResponse> {
    const cursor = await model.order.getAvailableOrdersByFlight(
      input.airlineCode,
      input.flightNumber
    );

    const availableOrdersList = new AvailableOrdersList();
    availableOrdersList.availableOrdersList = [];
    // @ts-ignore
    // tslint:disable-next-line
    await cursor.forEach(function(doc) {
      const availableOrder = new AvailableOrders();
      availableOrder.date = doc._id;
      availableOrder.orderNumber = doc.count;
      availableOrdersList.availableOrdersList.push(availableOrder);
    });

    const response = new AvailableOrdersResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";
    response.result = availableOrdersList;

    return response;
  }

  @Query(_ => PolicyResponse, { description: "read policy" })
  public async getPolicy(): //@Ctx() { headers }: IContext
  Promise<PolicyResponse> {
    //return gateways.antenna.readContract(input);

    /*try {
      await jwt.verify(headers['x-access-token'], SECRET_KEY);
    } catch (e) {
      const response = new PolicyResponse();
      const policy = new Policy();
      policy.premium = 0;
      policy.traditionalMaxBenefit = 0;
      policy.unknown = 0;
      policy.ontime = 0;
      policy.cancel = 0;
      policy.divert = 0;
      policy.delay0h = 0;
      policy.delay1h = 0;
      policy.delay2h = 0;
      policy.delay3h = 0;
      policy.delay4h = 0;
      policy.delay5h = 0;
      policy.delay6h = 0;
      policy.delay7h = 0;
      policy.delay8h = 0;
      policy.delay9h = 0;
      policy.delay10hplus = 0;
      response.result = policy;

      if (e.name === "TokenExpiredError") {
        response.code = StatusCode.TokenExpired.valueOf();
        response.message = "token expired";
      }
      else {
        // return server internal error
        response.code = StatusCode.InternalServerError.valueOf();
        response.message = e.message;
      }

      return response;
    }*/

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
  public async getRecommandation(@Ctx() { model }: IContext): Promise<
    RecommandResponse
  > {
    //await model.recommandation.upsertRecommandation("AS", 345, 5000000000000000000, 10000000000000000000);

    const rows = await model.recommandation.getRecommandations();

    const response = new RecommandResponse();
    const recommands = new Recommands();
    recommands.recommands = [];
    for (const row of rows) {
      const recommand = new Recommand();
      recommand.airLineCode = row.airlineCode;
      recommand.flightNumber = row.flightNumber;
      recommand.premium = row.premium / WEI_TO_ETHER;
      recommand.maxBenefit = row.maxBenefit / WEI_TO_ETHER;
      recommands.recommands.push(recommand);
    }

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
  public async getSupportedFlights(@Ctx() { model }: IContext): Promise<
    SupportedFlightsResponse
  > {
    const response = new SupportedFlightsResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    const rows = await model.flight.getAllFlights();
    const supportedFlights = new SupportedFlights();
    supportedFlights.flights = [];
    for (const row of rows) {
      const flight = new Flight();
      flight.airlineCode = row.airlineCode;
      flight.flightNumber = row.flightNumber;
      flight.srcAirport = row.srcAirport;
      flight.dstAirport = row.dstAirport;
      supportedFlights.flights.push(flight);
    }
    response.result = supportedFlights;

    return response;
  }
}
