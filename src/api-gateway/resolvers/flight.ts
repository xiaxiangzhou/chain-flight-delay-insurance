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

@ObjectType()
export class OrderDetail {
  @Field(_ => String)
  public airlineCode: string;

  @Field(_ => Number)
  public flightNumber: number;

  @Field(_ => String)
  public date: string;

  @Field(_ => String)
  public sellerEmail: string;

  @Field(_ => String)
  public buyerEmail: string;

  @Field(_ => Number)
  public scheduleTakeOff: number;

  @Field(_ => String)
  public contractAddress: string;

  @Field(_ => String)
  public creatorAddress: string;

  @Field(_ => String)
  public buyerAddress: string;

  @Field(_ => String)
  public platformAddress: string;

  @Field(_ => String)
  public oracleAddress: string;

  @Field(_ => Number)
  public orderStatus: number;

  @Field(_ => Number)
  public maxBenefit: number;

  @Field(_ => Number)
  public premium: number;

  @Field(_ => String)
  public flightContractId: string;

  @Field(_ => String)
  public oracleContractId: string;
}

export enum OrderDetailsCode {
  Success,
  UserNotFound,
  InternalServerError
}

@ObjectType()
export class OrderDetails {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => [OrderDetail], { nullable: true })
  public orderDetails: Array<OrderDetail>;
}

@ObjectType()
export class OrdersByBuyerEmailResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => OrderDetails)
  public result: OrderDetails;
}

@ArgsType()
export class OrdersByBuyerEmailRequest {
  @Field(_ => String)
  public buyerEmail: string;

  @Field(_ => Number, { nullable: true })
  public orderStatus: number;

  @Field(_ => Number)
  public startPoint: number;

  @Field(_ => Number)
  public pageSize: number;
}

export enum ContractDetailCode {
  Success,
  ContractNotFound,
  InternalServerError
}

@ObjectType()
export class ContractDetail {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => String)
  public name: string;

  @Field(_ => String)
  public abi: string;

  @Field(_ => String)
  public bin: string;
}

@ObjectType()
export class ContractByIdResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => ContractDetail)
  public result: ContractDetail;
}

export enum ContractConfigCode {
  Success,
  InternalServerError
}

@ObjectType()
export class ContractConfig {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => String)
  public contractName: string;

  @Field(_ => String)
  public contractAbi: string;

  @Field(_ => String)
  public contractBin: string;

  @Field(_ => String)
  public blockchainAddress: string;
}

@ObjectType()
export class ContractConfigResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => ContractConfig)
  public result: ContractConfig;
}

@ArgsType()
export class ContractByIdRequest {
  @Field(_ => String)
  public id: string;
}

export enum BuyContractCode {
  Success,
  AlreadyBought,
  InternalServerError
}

@ObjectType()
export class BuyContractStatus {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;
}

@ObjectType()
export class BuyContractResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => BuyContractStatus)
  public result: BuyContractStatus;
}

@ArgsType()
export class BuyContractRequest {
  @Field(_ => String)
  public contractAddress: string;

  @Field(_ => String)
  public buyerEmail: string;
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
      345,
      "2019-09-12",
      "",
      "",
      1568262099,
      "io142m2eetuhsc0ax0hjy46gnw0asgf76h4nlsfj4",
      "io19dvyeuwpc9lvjx6tu3ndepw3zuvsfdqj8jmk6v",
      "",
      "io19dvyeuwpc9lvjx6tu3ndepw3zuvsfdqj8jmk6v",
      "io1vlctxpm5gylma07vuyt6lxhuasnsftwrvq36z5",
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

  @Query(_ => OrdersByBuyerEmailResponse, {
    description: "read orders of a buyer"
  })
  public async getOrdersByBuyerEmail(
    @Args(_ => OrdersByBuyerEmailRequest)
    input: OrdersByBuyerEmailRequest,
    @Ctx() { model }: IContext
  ): Promise<OrdersByBuyerEmailResponse> {
    const response = new OrdersByBuyerEmailResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    try {
      const res = await model.user.findUser(input.buyerEmail);
      const orderDetails = new OrderDetails();
      orderDetails.orderDetails = [];
      response.result = orderDetails;

      if (res.length === 0) {
        orderDetails.code = OrderDetailsCode.UserNotFound.valueOf();
        orderDetails.message = "User Not Found !";
        return response;
      }

      let orders = [];
      if (input.orderStatus === undefined) {
        // not status specific
        orders = await model.order.getOrdersByBuyerEmail(
          input.buyerEmail,
          input.startPoint,
          input.pageSize
        );
      } else {
        orders = await model.order.getOrdersByBuyerEmailByOrderStatus(
          input.buyerEmail,
          input.orderStatus,
          input.startPoint,
          input.pageSize
        );
      }

      for (const order of orders) {
        const orderDetail = new OrderDetail();
        orderDetail.airlineCode = order.airlineCode;
        orderDetail.flightNumber = order.flightNumber;
        orderDetail.date = order.date;
        orderDetail.sellerEmail = order.sellerEmail;
        orderDetail.buyerEmail = order.buyerEmail;
        orderDetail.scheduleTakeOff = order.scheduleTakeOff;
        orderDetail.contractAddress = order.contractAddress;
        orderDetail.creatorAddress = order.creatorAddress;
        orderDetail.buyerAddress = order.buyerAddress;
        orderDetail.platformAddress = order.platformAddress;
        orderDetail.oracleAddress = order.oracleAddress;
        orderDetail.orderStatus = order.orderStatus;
        orderDetail.maxBenefit = order.maxBenefit;
        orderDetail.premium = order.premium;
        orderDetail.flightContractId = order.flightContractId;
        orderDetail.oracleContractId = order.oracleContractId;

        response.result.orderDetails.push(orderDetail);
      }

      orderDetails.code = OrderDetailsCode.Success.valueOf();
      orderDetails.message = "";
      return response;
    } catch (e) {
      const orderDetails = new OrderDetails();
      orderDetails.code = OrderDetailsCode.InternalServerError.valueOf();
      orderDetails.message = "Internal Server Error !";
      response.result = orderDetails;

      return response;
    }
  }

  @Query(_ => BuyContractResponse, {
    description: "buy contract"
  })
  public async buyContract(
    @Args(_ => BuyContractRequest)
    input: BuyContractRequest,
    @Ctx() { model }: IContext
  ): Promise<BuyContractResponse> {
    const response = new BuyContractResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    try {
      const buyContractStatus = new BuyContractStatus();
      const res = await model.order.getOrderByContractAddress(
        input.contractAddress
      );

      if (res.buyerEmail !== "" && res.buyerEmail !== undefined) {
        buyContractStatus.code = BuyContractCode.AlreadyBought.valueOf();
        buyContractStatus.message = "Already Bought !";
        response.result = buyContractStatus;
        return response;
      }

      await model.order.buyOrder(input.contractAddress, input.buyerEmail);
      buyContractStatus.code = BuyContractCode.Success.valueOf();
      buyContractStatus.message = "";
      response.result = buyContractStatus;
      return response;
    } catch (e) {
      const buyContractStatus = new BuyContractStatus();
      buyContractStatus.code = BuyContractCode.InternalServerError.valueOf();
      buyContractStatus.message = "Internal Server Error !";
      response.result = buyContractStatus;

      return response;
    }
  }

  @Query(_ => ContractByIdResponse, {
    description: "read contract from id"
  })
  public async getContractById(
    @Args(_ => ContractByIdRequest)
    input: ContractByIdRequest,
    @Ctx() { model }: IContext
  ): Promise<ContractByIdResponse> {
    const response = new ContractByIdResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    //let contractId = "one";

    try {
      const res = await model.contract.getContract(input.id);
      const contractDetail = new ContractDetail();
      contractDetail.name = "";
      contractDetail.abi = "";
      contractDetail.bin = "";
      response.result = contractDetail;

      if (res === null) {
        contractDetail.code = ContractDetailCode.ContractNotFound.valueOf();
        contractDetail.message = "Contract Not Found !";
        return response;
      }

      contractDetail.name = res.name;
      contractDetail.abi = res.abi;
      contractDetail.bin = res.bin;
      contractDetail.code = ContractDetailCode.Success.valueOf();
      contractDetail.message = "";
      return response;
    } catch (e) {
      const contractDetail = new ContractDetail();
      contractDetail.code = ContractDetailCode.InternalServerError.valueOf();
      contractDetail.message = "Internal Server Error !";
      contractDetail.name = "";
      contractDetail.abi = "";
      contractDetail.bin = "";
      response.result = contractDetail;

      return response;
    }
  }

  @Query(_ => ContractConfigResponse, {
    description: "read contract config"
  })
  public async getContractConfig(@Ctx() { model }: IContext): Promise<
    ContractConfigResponse
  > {
    const response = new ContractConfigResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    const contractName = "one";

    try {
      const res = await model.contract.getContractByName(contractName);
      const contractConfig = new ContractConfig();
      contractConfig.contractName = res.name;
      contractConfig.contractAbi = res.abi;
      contractConfig.contractBin = res.bin;
      contractConfig.blockchainAddress = "api.testnet.iotex.one:80";
      response.result = contractConfig;

      contractConfig.code = ContractConfigCode.Success.valueOf();
      contractConfig.message = "";
      return response;
    } catch (e) {
      const contractConfig = new ContractConfig();
      contractConfig.code = ContractConfigCode.InternalServerError.valueOf();
      contractConfig.message = "Internal Server Error !";
      contractConfig.contractName = "";
      contractConfig.contractAbi = "";
      contractConfig.contractBin = "";
      response.result = contractConfig;

      return response;
    }
  }
}
