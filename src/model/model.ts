// @ts-ignore
import { MyServer } from "../server/start-server";
import { FlightModel } from "./flight";
import { OrderModel } from "./order";
import { RecommandationModel } from "./recommandation";

export type Model = {
  flight: FlightModel;
  order: OrderModel;
  recommandation: RecommandationModel;
};

export function setModel(server: MyServer): void {
  // tslint:disable-next-line
  server.model = ((server.model || {}) as any) as Model;
  server.model.flight = new FlightModel(server.gateways);
  server.model.order = new OrderModel(server.gateways);
  server.model.recommandation = new RecommandationModel(server.gateways);
}
