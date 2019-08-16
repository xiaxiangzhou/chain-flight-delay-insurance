// @ts-ignore
import { MyServer } from "../server/start-server";
import { ContractModel } from "./contract";
import { FlightModel } from "./flight";
import { OrderModel } from "./order";
import { RecommandationModel } from "./recommandation";
import { UserModel } from "./user";

export type Model = {
  user: UserModel;
  flight: FlightModel;
  order: OrderModel;
  recommandation: RecommandationModel;
  contract: ContractModel;
};

export function setModel(server: MyServer): void {
  // tslint:disable-next-line
  server.model = ((server.model || {}) as any) as Model;
  server.model.user = new UserModel(server.gateways);
  server.model.flight = new FlightModel(server.gateways);
  server.model.order = new OrderModel(server.gateways);
  server.model.recommandation = new RecommandationModel(server.gateways);
  server.model.contract = new ContractModel(server.gateways);
}
