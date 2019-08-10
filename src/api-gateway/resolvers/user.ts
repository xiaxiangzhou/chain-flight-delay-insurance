// tslint:disable:no-any
import * as bcrypt from "bcryptjs";
import * as nodemailer from "nodemailer";
import * as randomstring from "randomstring";
import {
  Args,
  ArgsType,
  Ctx,
  Query,
  Resolver,
  ResolverInterface
} from "type-graphql";
import { Field, ObjectType } from "type-graphql";
import { Model } from "../../model";
import { StatusCode } from "./flight";

export interface IContext {
  model: Model;
}

export enum UserRegisterCode {
  Success,
  AlreadyRegister,
  InternalServerError
}

@ObjectType()
export class UserRegisterStatus {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;
}

@ObjectType()
export class UserRegisterResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => UserRegisterStatus)
  public result: UserRegisterStatus;
}

@ArgsType()
export class UserRegisterRequest {
  @Field(_ => String)
  public email: string;

  @Field(_ => String)
  public password: string;
}

export enum UserLoginCode {
  Success,
  UserNotFound,
  InvalidCredential,
  InternalServerError
}

@ObjectType()
export class UserLoginStatus {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;
}

@ObjectType()
export class UserLoginResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => UserLoginStatus)
  public result: UserLoginStatus;
}

@ArgsType()
export class UserLoginRequest {
  @Field(_ => String)
  public email: string;

  @Field(_ => String)
  public password: string;
}

export enum ChangePasswordCode {
  Success,
  InvalidOldPassword,
  UserNotFound,
  InternalServerError
}

@ObjectType()
export class ChangePasswordStatus {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;
}

@ObjectType()
export class ChangePasswordResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => ChangePasswordStatus)
  public result: ChangePasswordStatus;
}

@ArgsType()
export class ChangePasswordRequest {
  @Field(_ => String)
  public email: string;

  @Field(_ => String)
  public password: string;

  @Field(_ => String)
  public newPassword: string;
}

export enum ResetPasswordInitCode {
  Success,
  UserNotFound,
  MailSentError,
  InternalServerError
}

@ObjectType()
export class ResetPasswordInitStatus {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;
}

@ObjectType()
export class ResetPasswordInitResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => ResetPasswordInitStatus)
  public result: ResetPasswordInitStatus;
}

@ArgsType()
export class ResetPasswordInitRequest {
  @Field(_ => String)
  public email: string;
}

export enum ResetPasswordFinishCode {
  Success,
  UserNotFound,
  InvalidToken,
  Timeout,
  TokenUsed,
  InternalServerError
}

@ObjectType()
export class ResetPasswordFinishStatus {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;
}

@ObjectType()
export class ResetPasswordFinishResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => ResetPasswordFinishStatus)
  public result: ResetPasswordFinishStatus;
}

@ArgsType()
export class ResetPasswordFinishRequest {
  @Field(_ => String)
  public email: string;

  @Field(_ => String)
  public token: string;

  @Field(_ => String)
  public password: string;
}

@Resolver(_ => String)
export class UserResolver implements ResolverInterface<() => String> {
  @Query(_ => String)
  public async health(): Promise<string> {
    return "OK";
  }

  @Query(_ => UserRegisterResponse, {
    description: "register user"
  })
  public async registerUser(
    @Args(_ => UserRegisterRequest)
    input: UserRegisterRequest,
    @Ctx() { model }: IContext
  ): Promise<UserRegisterResponse> {
    const response = new UserRegisterResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(input.password, salt);
      await model.user.registerUser(input.email, hash);

      const userRegisterStatus = new UserRegisterStatus();
      userRegisterStatus.code = UserRegisterCode.Success.valueOf();
      userRegisterStatus.message = "User Registered Sucessfully !";
      response.result = userRegisterStatus;

      return response;
    } catch (e) {
      const userRegisterStatus = new UserRegisterStatus();
      if (e.code === 11000) {
        userRegisterStatus.code = UserRegisterCode.AlreadyRegister.valueOf();
        userRegisterStatus.message = "User Already Registered !";
      } else {
        userRegisterStatus.code = UserRegisterCode.InternalServerError.valueOf();
        userRegisterStatus.message = "Internal Server Error !";
      }
      response.result = userRegisterStatus;

      return response;
    }
  }

  @Query(_ => UserLoginResponse, {
    description: "login user"
  })
  public async loginUser(
    @Args(_ => UserLoginRequest)
    input: UserLoginRequest,
    @Ctx() { model }: IContext
  ): Promise<UserLoginResponse> {
    const response = new UserLoginResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    try {
      const res = await model.user.findUser(input.email);
      const userLoginStatus = new UserLoginStatus();

      if (res.length === 0) {
        userLoginStatus.code = UserLoginCode.UserNotFound.valueOf();
        userLoginStatus.message = "User Not Found !";
      } else {
        const user = res[0];
        if (bcrypt.compareSync(input.password, user.hashedPassword)) {
          userLoginStatus.code = UserLoginCode.Success.valueOf();
          userLoginStatus.message = input.email;
        } else {
          userLoginStatus.code = UserLoginCode.InvalidCredential.valueOf();
          userLoginStatus.message = "Invalid Credentials !";
        }
      }

      response.result = userLoginStatus;
      return response;
    } catch (e) {
      const userLoginStatus = new UserLoginStatus();
      userLoginStatus.code = UserLoginCode.InternalServerError.valueOf();
      userLoginStatus.message = "Internal Server Error !";
      response.result = userLoginStatus;

      return response;
    }
  }

  @Query(_ => ChangePasswordResponse, {
    description: "change password"
  })
  public async changePassword(
    @Args(_ => ChangePasswordRequest)
    input: ChangePasswordRequest,
    @Ctx() { model }: IContext
  ): Promise<ChangePasswordResponse> {
    const response = new ChangePasswordResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    try {
      const res = await model.user.findUser(input.email);
      const changePasswordStatus = new ChangePasswordStatus();

      if (res.length === 0) {
        changePasswordStatus.code = ChangePasswordCode.UserNotFound.valueOf();
        changePasswordStatus.message = "User Not Found !";
      } else {
        const user = res[0];
        const oldHashedPassword = user.hashedPassword;

        if (bcrypt.compareSync(input.password, oldHashedPassword)) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(input.newPassword, salt);
          await model.user.changePassword(input.email, hash);

          changePasswordStatus.code = ChangePasswordCode.Success.valueOf();
          changePasswordStatus.message = "Password Updated Sucessfully !";
        } else {
          changePasswordStatus.code = ChangePasswordCode.InvalidOldPassword.valueOf();
          changePasswordStatus.message = "Invalid Old Password !";
        }
      }

      response.result = changePasswordStatus;
      return response;
    } catch (e) {
      const changePasswordStatus = new ChangePasswordStatus();
      changePasswordStatus.code = ChangePasswordCode.InternalServerError.valueOf();
      changePasswordStatus.message = "Internal Server Error !";
      response.result = changePasswordStatus;

      return response;
    }
  }

  @Query(_ => ResetPasswordInitResponse, {
    description: "reset password init"
  })
  public async resetPasswordInit(
    @Args(_ => ResetPasswordInitRequest)
    input: ResetPasswordInitRequest,
    @Ctx() { model }: IContext
  ): Promise<ResetPasswordInitResponse> {
    const response = new ResetPasswordInitResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    try {
      const res = await model.user.findUser(input.email);
      const resetPasswordInitStatus = new ResetPasswordInitStatus();

      if (res.length === 0) {
        resetPasswordInitStatus.code = ResetPasswordInitCode.UserNotFound.valueOf();
        resetPasswordInitStatus.message = "User Not Found !";
      } else {
        const user = res[0];

        const random = randomstring.generate(8);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(random, salt);
        const now = new Date();

        await model.user.saveTempPassword(user.email, hash, now.getTime());

        try {
          const configName = "Xiangzhou Xia";
          const configPassword = "a15120079705";
          const configEmail = "xiaxiangzhou@gmail.com";

          const transporter = nodemailer.createTransport(
            `smtps://${configEmail}:${configPassword}@smtp.gmail.com`
          );

          const mailOptions = {
            from: `"${configName}" <${configEmail}>`,
            to: user.email,
            subject: "Reset Password Request ",
            html: `Hello,

    			      Your reset password token is <b>${random}</b>. 
    			  If you are viewing this mail from a Android Device click this <a href="http://learn2crack/${random}">link</a>. 
    			  The token is valid for only 10 minutes.

    			  Thanks,
    			  Flight Delay Insurance.`
          };

          await transporter.sendMail(mailOptions);
          resetPasswordInitStatus.code = ResetPasswordInitCode.Success.valueOf();
          resetPasswordInitStatus.message = "Check mail for instructions";
        } catch (e) {
          resetPasswordInitStatus.code = ResetPasswordInitCode.MailSentError.valueOf();
          resetPasswordInitStatus.message = "Sent Mail Error, Please Retry!";
        }
      }

      response.result = resetPasswordInitStatus;
      return response;
    } catch (e) {
      const resetPasswordInitStatus = new ResetPasswordInitStatus();
      resetPasswordInitStatus.code = ResetPasswordInitCode.InternalServerError.valueOf();
      resetPasswordInitStatus.message = "Internal Server Error !";
      response.result = resetPasswordInitStatus;

      return response;
    }
  }

  @Query(_ => ResetPasswordFinishResponse, {
    description: "reset password finish"
  })
  public async resetPasswordFinish(
    @Args(_ => ResetPasswordFinishRequest)
    input: ResetPasswordFinishRequest,
    @Ctx() { model }: IContext
  ): Promise<ResetPasswordFinishResponse> {
    const response = new ResetPasswordFinishResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";

    try {
      const res = await model.user.findUser(input.email);
      const resetPasswordFinishStatus = new ResetPasswordFinishStatus();

      if (res.length === 0) {
        resetPasswordFinishStatus.code = ResetPasswordFinishCode.UserNotFound.valueOf();
        resetPasswordFinishStatus.message = "User Not Found !";
        response.result = resetPasswordFinishStatus;
        return response;
      }

      const user = res[0];

      if (
        user.tempPasswordTime === undefined ||
        user.tempPassword === undefined
      ) {
        resetPasswordFinishStatus.code = ResetPasswordFinishCode.TokenUsed.valueOf();
        resetPasswordFinishStatus.message = "This Token have been Used !";
        response.result = resetPasswordFinishStatus;
        return response;
      }

      const now = new Date();
      const diff = now.getTime() - user.tempPasswordTime;
      const seconds = Math.floor(diff / 1000);

      if (seconds < 600) {
        resetPasswordFinishStatus.code = ResetPasswordFinishCode.Success.valueOf();
        resetPasswordFinishStatus.message = "Password Changed Successfully !";

        if (bcrypt.compareSync(input.token, user.tempPassword)) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(input.password, salt);

          await model.user.clearTempPassword(input.email, hash);

          resetPasswordFinishStatus.code = ResetPasswordFinishCode.Success.valueOf();
          resetPasswordFinishStatus.message = "Password Changed Successfully !";
        } else {
          resetPasswordFinishStatus.code = ResetPasswordFinishCode.InvalidToken.valueOf();
          resetPasswordFinishStatus.message = "Invalid Token !";
        }
      } else {
        resetPasswordFinishStatus.code = ResetPasswordFinishCode.Timeout.valueOf();
        resetPasswordFinishStatus.message = "Time Out ! Try again";
      }

      response.result = resetPasswordFinishStatus;
      return response;
    } catch (e) {
      const resetPasswordFinishStatus = new ResetPasswordFinishStatus();
      resetPasswordFinishStatus.code = ResetPasswordFinishCode.InternalServerError.valueOf();
      resetPasswordFinishStatus.message = "Internal Server Error !";
      response.result = resetPasswordFinishStatus;

      return response;
    }
  }
}
