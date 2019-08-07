// @ts-ignore
import { MyServer } from "../server/start-server";
import { FlightModel } from "./flight";

export type Model = {
  flight: FlightModel;
};

export function setModel(server: MyServer): void {
  /* tslint:disable-next-line */
  server.model = ((server.model || {}) as any) as Model;
  server.model.flight = new FlightModel(server.gateways);
}
