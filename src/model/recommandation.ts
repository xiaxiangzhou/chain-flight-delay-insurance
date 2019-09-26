// @ts-ignore
import mongoose, { DocumentQuery } from "mongoose";

const Schema = mongoose.Schema;

type Opts = {
  mongoose: mongoose.Mongoose;
};

type IRecommandation = {
  airlineCode: string;
  flightNumber: number;
  premium: number;
  maxBenefit: number;
};

type IRecommandationDoc = mongoose.Document &
  IRecommandation & {
    createAt: Date;
    updateAt: Date;
  };

export class RecommandationModel {
  public Model: mongoose.Model<IRecommandationDoc>;

  constructor({ mongoose }: Opts) {
    const RecommandationSchema = new Schema({
      airlineCode: { type: String },
      flightNumber: { type: Number },
      premium: { type: Number },
      maxBenefit: { type: Number },
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    //FlightSchema.index({ userId: 1 });

    RecommandationSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    RecommandationSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("Recommandation", RecommandationSchema);
  }

  public upsertRecommandation(
    airlineCode: string,
    flightNumber: number,
    premium: number,
    maxBenefit: number
  ): DocumentQuery<IRecommandationDoc | null, IRecommandationDoc> {
    return this.Model.findOneAndUpdate(
      { airlineCode, flightNumber, premium, maxBenefit },
      { airlineCode, flightNumber, premium, maxBenefit },
      { upsert: true, new: true }
    );
  }

  public getRecommandations(
    startPoint: number,
    pageSize: number
  ): DocumentQuery<Array<IRecommandationDoc>, IRecommandationDoc> {
    return this.Model.find()
      .skip(startPoint)
      .limit(pageSize);
  }
}
