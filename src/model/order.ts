// @ts-ignore
import mongoose, { DocumentQuery } from "mongoose";

const Schema = mongoose.Schema;
export const SECONDS_IN_DAY = 86400;
export const TIME_WINDOW = 90;

type Opts = {
  mongoose: mongoose.Mongoose;
};

type IOrder = {
  airlineCode: string;
  flightNumber: number;
  date: string;
  sellerEmail: string;
  buyerEmail: string;
  timestampEndOfDate: number;
  contractAddress: string;
  creatorAddress: string;
  buyerAddress: string;
  oracleAddress: string;
  orderStatus: number;
  maxBenefit: number;
  premium: number;
  flightContractName: string;
};

export type IOrderDoc = mongoose.Document &
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
      timestampEndOfDate: { type: Number },
      contractAddress: { type: String },
      creatorAddress: { type: String },
      buyerAddress: { type: String },
      oracleAddress: { type: String },
      orderStatus: { type: Number }, // 0 means open, 1 means bought, 2 means reported, 3 means closed, 4 means prepare to buy
      maxBenefit: { type: Number },
      premium: { type: Number },
      flightContractName: { type: String },
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
    timestampEndOfDate: number,
    contractAddress: string,
    creatorAddress: string,
    buyerAddress: string,
    oracleAddress: string,
    orderStatus: number,
    maxBenefit: number,
    premium: number,
    flightContractName: string
  ): DocumentQuery<IOrderDoc | null, IOrderDoc> {
    return this.Model.findOneAndUpdate(
      {
        airlineCode,
        flightNumber,
        date,
        sellerEmail,
        buyerEmail,
        timestampEndOfDate,
        contractAddress,
        creatorAddress,
        buyerAddress,
        oracleAddress,
        orderStatus,
        maxBenefit,
        premium,
        flightContractName
      },
      {
        airlineCode,
        flightNumber,
        date,
        sellerEmail,
        buyerEmail,
        timestampEndOfDate,
        contractAddress,
        creatorAddress,
        buyerAddress,
        oracleAddress,
        orderStatus,
        maxBenefit,
        premium,
        flightContractName
      },
      { upsert: true, new: true }
    );
  }

  public prepareToBuy(
    contractAddress: string,
    buyerEmail: string,
    airlineCode: string,
    flightNumber: number
  ): DocumentQuery<IOrderDoc | null, IOrderDoc> {
    return this.Model.findOneAndUpdate(
      {
        contractAddress
      },
      {
        buyerEmail: buyerEmail,
        contractAddress: contractAddress,
        airlineCode: airlineCode,
        flightNumber: flightNumber,
        orderStatus: 4
      },
      { new: true }
    );
  }

  public buyOrder(
    contractAddress: string,
    buyerEmail: string,
    airlineCode: string,
    flightNumber: number
  ): DocumentQuery<IOrderDoc | null, IOrderDoc> {
    return this.Model.findOneAndUpdate(
      {
        contractAddress
      },
      {
        buyerEmail: buyerEmail,
        contractAddress: contractAddress,
        airlineCode: airlineCode,
        flightNumber: flightNumber,
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

  public getPendingOrdersByBuyerEmail(
    buyerEmail: string
  ): DocumentQuery<Array<IOrderDoc>, IOrderDoc> {
    /*return this.Model.find({ buyerEmail: buyerEmail })
      .where("orderStatus")
      .ne(3) // not closed
      .sort({ timestampEndOfDate: 1 });*/
    return this.Model.find({
      buyerEmail: buyerEmail,
      orderStatus: { $lt: 3 }
    }).sort({ timestampEndOfDate: 1 });
  }

  public getClosedOrdersByBuyerEmail(
    buyerEmail: string,
    startPoint: number,
    pageSize: number
  ): DocumentQuery<Array<IOrderDoc>, IOrderDoc> {
    return this.Model.find({ buyerEmail: buyerEmail, orderStatus: 3 })
      .sort({ timestampEndOfDate: -1 })
      .skip(startPoint)
      .limit(pageSize);
  }

  public getClosedOrdersCountByBuyerEmail(
    buyerEmail: string
  ): DocumentQuery<Array<IOrderDoc>, IOrderDoc> {
    return this.Model.count({ buyerEmail: buyerEmail, orderStatus: 3 });
  }

  public getOrdersByBuyerEmailByOrderStatus(
    buyerEmail: string,
    orderStatus: number,
    startPoint: number,
    pageSize: number
  ): number {
    return this.Model.find({ buyerEmail: buyerEmail, orderStatus: orderStatus })
      .sort({ timestampEndOfDate: -1 })
      .skip(startPoint)
      .limit(pageSize);
  }

  public getAvailableOrdersByFlightAndDate(
    airlineCode: string,
    flightNumber: number,
    date: string
  ): DocumentQuery<Array<IOrderDoc>, IOrderDoc> {
    const currentTimestamp = Date.now() / 1000;
    return this.Model.find({
      airlineCode,
      flightNumber,
      date,
      orderStatus: 0,
      timestampEndOfDate: { $gte: currentTimestamp + SECONDS_IN_DAY * 2 }
    });
  }

  public getAvailableOrdersByDate(
    date: string
  ): DocumentQuery<Array<IOrderDoc>, IOrderDoc> {
    const currentTimestamp = Date.now() / 1000;
    return this.Model.find({
      date,
      orderStatus: 0,
      timestampEndOfDate: { $gte: currentTimestamp + SECONDS_IN_DAY * 2 }
    });
  }

  public getAvailableOrdersByFlight(
    airlineCode: string,
    flightNumber: number
  ): mongoose.AggregationCursor {
    const currentTimestamp = Date.now() / 1000;
    return this.Model.collection.aggregate([
      {
        $match: {
          airlineCode: airlineCode,
          flightNumber: flightNumber,
          orderStatus: 0,
          timestampEndOfDate: { $gte: currentTimestamp + SECONDS_IN_DAY * 2 }
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

  public getAvailableOrders(): mongoose.AggregationCursor {
    const currentTimestamp = Date.now() / 1000;
    return this.Model.collection.aggregate([
      {
        $match: {
          orderStatus: 0,
          timestampEndOfDate: {
            $gte: currentTimestamp + SECONDS_IN_DAY * 2,
            $lte: currentTimestamp + TIME_WINDOW * SECONDS_IN_DAY
          }
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
