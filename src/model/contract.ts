// @ts-ignore
import mongoose, { DocumentQuery } from "mongoose";
import { InsertWriteOpResult } from "typeorm";

const Schema = mongoose.Schema;

type Opts = {
  mongoose: mongoose.Mongoose;
};

type IContract = {
  name: string;
  abi: string;
  bin: string;
};

type IContractDoc = mongoose.Document &
  IContract & {
    createAt: Date;
    updateAt: Date;
  };

export class ContractModel {
  public Model: mongoose.Model<IContractDoc>;

  constructor({ mongoose }: Opts) {
    const ContractSchema = new Schema({
      name: { type: String },
      abi: { type: String },
      bin: { type: String },
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    ContractSchema.index({ name: 1 });

    ContractSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    ContractSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("Contract", ContractSchema);
  }

  public saveContract(
    name: string,
    abi: string,
    bin: string
  ): InsertWriteOpResult {
    return this.Model.collection.insertOne({
      name: name,
      abi: abi,
      bin: bin
    });
  }

  public getContract(
    id: string
  ): DocumentQuery<IContractDoc | null, IContractDoc> {
    return this.Model.findOne({ _id: id });
  }
}
