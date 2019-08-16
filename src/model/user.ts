// @ts-ignore
import mongoose, { DocumentQuery } from "mongoose";
import { InsertWriteOpResult } from "typeorm";

const Schema = mongoose.Schema;

type Opts = {
  mongoose: mongoose.Mongoose;
};

type IUser = {
  email: string;
  hashedPassword: string;
  tempPassword: string;
  tempPasswordTime: number;
};

type IUserDoc = mongoose.Document &
  IUser & {
    createAt: Date;
    updateAt: Date;
  };

export class UserModel {
  public Model: mongoose.Model<IUserDoc>;

  constructor({ mongoose }: Opts) {
    const UserSchema = new Schema({
      email: { type: String },
      hashedPassword: { type: String },
      tempPassword: { type: String },
      tempPasswordTime: { type: Number },
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    UserSchema.index({ email: 1 });

    UserSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    UserSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("User", UserSchema);
  }

  public registerUser(email: string, hash: string): InsertWriteOpResult {
    return this.Model.collection.insertOne({
      email: email,
      hashedPassword: hash
    });
  }

  public changePassword(
    email: string,
    hash: string
  ): DocumentQuery<IUserDoc | null, IUserDoc> {
    return this.Model.findOneAndUpdate(
      { email: email },
      { email: email, hashedPassword: hash }
    );
  }

  public saveTempPassword(
    email: string,
    tempPassword: string,
    tempPasswordTime: number
  ): DocumentQuery<IUserDoc | null, IUserDoc> {
    return this.Model.findOneAndUpdate(
      { email: email },
      {
        email: email,
        tempPassword: tempPassword,
        tempPasswordTime: tempPasswordTime
      }
    );
  }

  public clearTempPassword(
    email: string,
    newHashPassword: string
  ): DocumentQuery<IUserDoc | null, IUserDoc> {
    return this.Model.findOneAndUpdate(
      { email: email },
      {
        email: email,
        hashedPassword: newHashPassword,
        tempPassword: undefined,
        tempPasswordTime: undefined
      }
    );
  }

  public findUser(email: string): DocumentQuery<Array<IUserDoc>, IUserDoc> {
    return this.Model.find({ email: email });
  }
}
