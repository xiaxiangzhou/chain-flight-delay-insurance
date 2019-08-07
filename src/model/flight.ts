// @ts-ignore
import mongoose, { DocumentQuery } from "mongoose";

const Schema = mongoose.Schema;

type Opts = {
  mongoose: mongoose.Mongoose;
};

type IFlight = {
  airlineCode: string;
  flightNumber: number;
  srcAirport: string;
  dstAirport: string;
};

type IFlightDoc = mongoose.Document &
  IFlight & {
    createAt: Date;
    updateAt: Date;
  };

export class FlightModel {
  public Model: mongoose.Model<IFlightDoc>;

  constructor({ mongoose }: Opts) {
    const FlightSchema = new Schema({
      airlineCode: { type: String },
      flightNumber: { type: Number },
      srcAirport: { type: String },
      dstAirport: { type: String },
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    FlightSchema.index({ userId: 1 });

    FlightSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    FlightSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("Flight", FlightSchema);
  }

  public upsertFlight(
    airlineCode: string,
    flightNumber: number,
    srcAirport: string,
    dstAirport: string
  ): DocumentQuery<IFlightDoc | null, IFlightDoc> {
    return this.Model.findOneAndUpdate(
      { airlineCode, flightNumber, srcAirport, dstAirport },
      { airlineCode, flightNumber, srcAirport, dstAirport },
      { upsert: true, new: true }
    );
  }

  public getAllFlights(): DocumentQuery<Array<IFlightDoc>, IFlightDoc> {
    return this.Model.find();
  }
}
