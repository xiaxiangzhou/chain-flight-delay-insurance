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

export enum StatusCode {
  Success,
  Unavailable
}

registerEnumType(StatusCode, {
  name: "StatusCode"
});

@ObjectType()
export class Status {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;
}

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
export class FlightDetailResponse {
  @Field(_ => [Order], { nullable: true })
  public orders: Array<Order>;

  @Field(_ => Status)
  public status: Status;
}

@ObjectType()
export class PolicyResponse {
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

  @Field(_ => Status)
  public status: Status;
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
export class RecommandResponse {
  @Field(_ => [Recommand], { nullable: true })
  public recommands: Array<Recommand>;

  @Field(_ => Status)
  public status: Status;
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
  public pay: number;
}

@ObjectType()
export class OngoingPayoutResponse {
  @Field(_ => [OngoingPayout], { nullable: true })
  public payouts: Array<OngoingPayout>;

  @Field(_ => Status)
  public status: Status;
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

@Resolver(_ => String)
export class FlightsResolver implements ResolverInterface<() => String> {
  @Query(_ => String)
  public async health(): Promise<string> {
    return "OK";
  }

  @Query(_ => FlightDetailResponse, { description: "read flight detail" })
  public async getFlightDetail(
    @Args(_ => FlightDetailRequest)
    _: FlightDetailRequest
  ): Promise<FlightDetailResponse> {
    //return gateways.antenna.readContract(input);
    //const a = input;

    const response = new FlightDetailResponse();
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
    response.orders = [order1, order2, order3, order4];

    let status = new Status();
    status.code = StatusCode.Success.valueOf();
    status.message = "";
    response.status = status;

    return response;
  }

  @Query(_ => PolicyResponse, { description: "read policy" })
  public async getPolicy(): Promise<PolicyResponse> {
    //return gateways.antenna.readContract(input);

    const policy = new PolicyResponse();
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

    let status = new Status();
    status.code = StatusCode.Success.valueOf();
    status.message = "";
    policy.status = status;

    return policy;
  }

  @Query(_ => RecommandResponse, { description: "recommand some flights" })
  public async getRecommandation(): Promise<RecommandResponse> {
    //return gateways.antenna.readContract(input);

    const recommand = new RecommandResponse();
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

    recommand.recommands = [recommand1, recommand2, recommand3, recommand4];

    let status = new Status();
    status.code = StatusCode.Success.valueOf();
    status.message = "";
    recommand.status = status;

    return recommand;
  }

  @Query(_ => OngoingPayoutResponse, { description: "ongoing payouts" })
  public async getOngoingPayouts(): Promise<OngoingPayoutResponse> {
    //return gateways.antenna.readContract(input);

    const payouts = new OngoingPayoutResponse();
    const payout1 = new OngoingPayout();
    payout1.buyerAddress = "xxxxxxxxxxx1";
    payout1.contractAddress = "yyyyyyyyyyy1";
    payout1.airlineCode = "UA";
    payout1.flightNumber = 312;
    payout1.scheduleTakeOff = 1564145593;
    payout1.pay = 250;

    const payout2 = new OngoingPayout();
    payout2.buyerAddress = "xxxxxxxxxxx2";
    payout2.contractAddress = "yyyyyyyyyyy2";
    payout2.airlineCode = "AA";
    payout2.flightNumber = 234;
    payout2.scheduleTakeOff = 1564135593;
    payout2.pay = 200;

    const payout3 = new OngoingPayout();
    payout3.buyerAddress = "xxxxxxxxxxx3";
    payout3.contractAddress = "yyyyyyyyyyy3";
    payout3.airlineCode = "DL";
    payout3.flightNumber = 1312;
    payout3.scheduleTakeOff = 1554145593;
    payout3.pay = 400;

    const payout4 = new OngoingPayout();
    payout4.buyerAddress = "xxxxxxxxxxx4";
    payout4.contractAddress = "yyyyyyyyyyy4";
    payout4.airlineCode = "AA";
    payout4.flightNumber = 789;
    payout4.scheduleTakeOff = 1564143593;
    payout4.pay = 198;

    payouts.payouts = [payout1, payout2, payout3, payout4];

    let status = new Status();
    status.code = StatusCode.Success.valueOf();
    status.message = "";
    payouts.status = status;

    return payouts;
  }
}
