// @ts-ignore
import mongoose, { DocumentQuery } from "mongoose";
import { InsertWriteOpResult } from "typeorm";

const Schema = mongoose.Schema;

type Opts = {
  mongoose: mongoose.Mongoose;
};

type IVersion = {
  version: string;
  changeList: string;
  apkDownloadUrl: string;
};

type IVersionDoc = mongoose.Document &
  IVersion & {
    createAt: Date;
    updateAt: Date;
  };

export class VersionModel {
  public Model: mongoose.Model<IVersionDoc>;

  constructor({ mongoose }: Opts) {
    const VersionSchema = new Schema({
      version: { type: String },
      changeList: { type: String },
      apkDownloadUrl: { type: String },
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    VersionSchema.index({ version: 1 });

    VersionSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    VersionSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("Version", VersionSchema);
  }

  public registerVersion(
    version: string,
    changeList: string,
    apkDownloadUrl: string
  ): InsertWriteOpResult {
    return this.Model.collection.insertOne({
      version: version,
      changeList: changeList,
      apkDownloadUrl: apkDownloadUrl
    });
  }

  public getVersion(version: string): DocumentQuery<IVersionDoc> {
    return this.Model.findOne({ version: version });
  }
}
