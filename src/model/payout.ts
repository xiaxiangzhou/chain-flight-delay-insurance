// @ts-ignore
import mongoose, { DocumentQuery } from "mongoose";

const Schema = mongoose.Schema;

type Opts = {
  mongoose: mongoose.Mongoose;
};

type IPayout = {
  buyerAddress: string;
  contractAddress: string;
  airlineCode: string;
  flightNumber: number;
  scheduleTakeOff: number;
  payTime: number;
  pay: number;
};

type IPayoutDoc = mongoose.Document &
  IPayout & {
    createAt: Date;
    updateAt: Date;
  };

export class PayoutModel {
  public Model: mongoose.Model<IPayoutDoc>;

  constructor({ mongoose }: Opts) {
    const PayoutSchema = new Schema({
      buyerAddress: { type: String },
      contractAddress: { type: String },
      airlineCode: { type: String },
      flightNumber: { type: Number },
      scheduleTakeOff: { type: Number },
      payTime: { type: Number },
      pay: { type: Number },
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    PayoutSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    PayoutSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("Payout", PayoutSchema);
  }

  public upsertPayout(
    buyerAddress: string,
    contractAddress: string,
    airlineCode: string,
    flightNumber: number,
    scheduleTakeOff: number,
    payTime: number,
    pay: number
  ): DocumentQuery<IPayoutDoc | null, IPayoutDoc> {
    return this.Model.findOneAndUpdate(
      {
        buyerAddress,
        contractAddress,
        airlineCode,
        flightNumber,
        scheduleTakeOff,
        payTime,
        pay
      },
      {
        buyerAddress,
        contractAddress,
        airlineCode,
        flightNumber,
        scheduleTakeOff,
        payTime,
        pay
      },
      { upsert: true, new: true }
    );
  }

  public getPayout(
    startPoint: number,
    pageSize: number
  ): DocumentQuery<Array<IPayoutDoc>, IPayoutDoc> {
    return this.Model.find()
      .sort({ scheduleTakeOff: -1 })
      .skip(startPoint)
      .limit(pageSize);
  }

  public countPayouts(): DocumentQuery<Array<IPayoutDoc>, IPayoutDoc> {
    return this.Model.count();
  }
}
