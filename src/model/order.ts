// @ts-ignore
import mongoose, { DocumentQuery } from "mongoose";

const Schema = mongoose.Schema;

type Opts = {
  mongoose: mongoose.Mongoose;
};

type IOrder = {
  airlineCode: string;
  flightNumber: number;
  date: string;
  sellerEmail: string;
  buyerEmail: string;
  scheduleTakeOff: number;
  contractAddress: string;
  creatorAddress: string;
  buyerAddress: string;
  platformAddress: string;
  oracleAddress: string;
  orderStatus: number;
  maxBenefit: number;
  premium: number;
  flightContractId: object;
  oracleContractId: object;
};

type IOrderDoc = mongoose.Document &
  IOrder & {
    createAt: Date;
    updateAt: Date;
  };

export class OrderModel {
  public Model: mongoose.Model<IOrderDoc>;

  constructor({ mongoose }: Opts) {
    const OrderSchema = new Schema({
      airlineCode: { type: String },
      flightNumber: { type: Number },
      date: { type: String },
      sellerEmail: { type: String },
      buyerEmail: { type: String },
      scheduleTakeOff: { type: Number },
      contractAddress: { type: String },
      creatorAddress: { type: String },
      buyerAddress: { type: String },
      platformAddress: { type: String },
      oracleAddress: { type: String },
      orderStatus: { type: Number },
      maxBenefit: { type: Number },
      premium: { type: Number },
      flightContractId: { type: Object },
      oracleContractId: { type: Object },
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    OrderSchema.index({ contractAddress: 1 }, { unique: true });

    OrderSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    OrderSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("Order", OrderSchema);
  }

  public upsertOrder(
    airlineCode: string,
    flightNumber: number,
    date: string,
    sellerEmail: string,
    buyerEmail: string,
    scheduleTakeOff: number,
    contractAddress: string,
    creatorAddress: string,
    buyerAddress: string,
    platformAddress: string,
    oracleAddress: string,
    orderStatus: number,
    maxBenefit: number,
    premium: number,
    flightContractId: object,
    oracleContractId: object
  ): DocumentQuery<IOrderDoc | null, IOrderDoc> {
    return this.Model.findOneAndUpdate(
      {
        airlineCode,
        flightNumber,
        date,
        sellerEmail,
        buyerEmail,
        scheduleTakeOff,
        contractAddress,
        creatorAddress,
        buyerAddress,
        platformAddress,
        oracleAddress,
        orderStatus,
        maxBenefit,
        premium,
        flightContractId,
        oracleContractId
      },
      {
        airlineCode,
        flightNumber,
        date,
        sellerEmail,
        buyerEmail,
        scheduleTakeOff,
        contractAddress,
        creatorAddress,
        buyerAddress,
        platformAddress,
        oracleAddress,
        orderStatus,
        maxBenefit,
        premium,
        flightContractId,
        oracleContractId
      },
      { upsert: true, new: true }
    );
  }

  public buyOrder(
    contractAddress: string,
    buyerEmail: string
  ): DocumentQuery<IOrderDoc | null, IOrderDoc> {
    return this.Model.findOneAndUpdate(
      {
        contractAddress
      },
      {
        buyerEmail: buyerEmail,
        contractAddress: contractAddress,
        orderStatus: 1
      },
      { upsert: true, new: true }
    );
  }

  public getOrderByContractAddress(
    contractAddress: string
  ): DocumentQuery<IOrderDoc | null, IOrderDoc> {
    return this.Model.findOne({ contractAddress: contractAddress });
  }

  public getOrdersByBuyerEmail(
    buyerEmail: string,
    startPoint: number,
    pageSize: number
  ): DocumentQuery<Array<IOrderDoc>, IOrderDoc> {
    return this.Model.find({ buyerEmail: buyerEmail })
      .sort({ scheduleTakeOff: -1 })
      .skip(startPoint)
      .limit(pageSize);
  }

  public getOrdersByBuyerEmailByOrderStatus(
    buyerEmail: string,
    orderStatus: number,
    startPoint: number,
    pageSize: number
  ): DocumentQuery<Array<IOrderDoc>, IOrderDoc> {
    return this.Model.find({ buyerEmail: buyerEmail, orderStatus: orderStatus })
      .sort({ scheduleTakeOff: -1 })
      .skip(startPoint)
      .limit(pageSize);
  }

  public getAvailableOrdersByFlightAndDate(
    airlineCode: string,
    flightNumber: number,
    date: string
  ): DocumentQuery<Array<IOrderDoc>, IOrderDoc> {
    return this.Model.find({ airlineCode, flightNumber, date, orderStatus: 0 });
  }

  public getAvailableOrdersByFlight(
    airlineCode: string,
    flightNumber: number
  ): mongoose.AggregationCursor {
    return this.Model.collection.aggregate([
      {
        $match: {
          airlineCode: airlineCode,
          flightNumber: flightNumber,
          orderStatus: 0
        }
      },
      {
        $group: {
          _id: "$date",
          count: {
            $sum: 1
          }
        }
      }
    ]);
  }
}
