// tslint:disable:no-any
// @ts-ignore
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

const CURRENT_VERSION = "1.0.0";

export interface IContext {
  model: Model;
  headers: { [id: string]: string };
}

export enum VersionUpdateCode {
  NoUpdate,
  NeedUpdate,
  IncorrectVersion,
  InternalServerError
}

@ObjectType()
export class VersionUpdate {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => String)
  public changeList: string;

  @Field(_ => Boolean)
  public forceUpdate: boolean;

  @Field(_ => String)
  public apkDownloadUrl: string;
}

@ObjectType()
export class VersionUpdateResponse {
  @Field(_ => Number)
  public code: number;

  @Field(_ => String)
  public message: string;

  @Field(_ => VersionUpdate)
  public result: VersionUpdate;
}

@ArgsType()
export class VersionUpdateRequest {
  @Field(_ => String)
  public version: string;
}

@Resolver(_ => String)
export class VersionResolver implements ResolverInterface<() => String> {
  @Query(_ => String)
  public async health(): Promise<string> {
    return "OK";
  }

  // version format: 主版本号.><子版本号>.<阶段版本号>
  @Query(_ => VersionUpdateResponse, {
    description: "register user"
  })
  public async versionUpdate(
    @Args(_ => VersionUpdateRequest)
    input: VersionUpdateRequest,
    @Ctx() { model }: IContext
  ): Promise<VersionUpdateResponse> {
    const response = new VersionUpdateResponse();
    response.code = StatusCode.Success.valueOf();
    response.message = "";
    const versionUpdate = new VersionUpdate();
    versionUpdate.forceUpdate = false;
    response.result = versionUpdate;

    try {
      let versions = input.version.split(".");
      let majorVersion = Number(versions[0]);

      let currentVersions = CURRENT_VERSION.split(".");
      let currentMajorVersion = Number(currentVersions[0]);

      if (majorVersion > currentMajorVersion) {
        versionUpdate.code = VersionUpdateCode.IncorrectVersion.valueOf();
        versionUpdate.message = "No Update !";
        versionUpdate.apkDownloadUrl = "";
        versionUpdate.changeList = "";
        return response;
      }

      if (majorVersion === currentMajorVersion) {
        versionUpdate.code = VersionUpdateCode.NoUpdate.valueOf();
        versionUpdate.message = "No Update !";
        versionUpdate.apkDownloadUrl = "";
        versionUpdate.changeList = "";
        return response;
      }

      let versionSet = await model.version.getVersion(CURRENT_VERSION);
      versionUpdate.code = VersionUpdateCode.NeedUpdate.valueOf();
      versionUpdate.message = "Need Update !";
      versionUpdate.forceUpdate = true;
      versionUpdate.changeList = versionSet.changeList;
      versionUpdate.apkDownloadUrl = versionSet.apkDownloadUrl;

      return response;
    } catch (e) {
      versionUpdate.code = VersionUpdateCode.InternalServerError.valueOf();
      versionUpdate.message = "Internal Server Error !";
      versionUpdate.changeList = "";
      versionUpdate.apkDownloadUrl = "";
      return response;
    }
  }
}
