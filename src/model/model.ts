// @ts-ignore
import { MyServer } from "../server/start-server";
import { FlightModel } from "./flight";

export type Model = {
  flight: FlightModel;
};

export function setModel(server: MyServer): void {
  // @ts-ignore
  server.model = ((server.model || {}) as any) as Model;
  server.model.flight = new FlightModel(server.gateways);
}
