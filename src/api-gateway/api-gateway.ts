import { ApolloServer } from "apollo-server-koa";
import * as path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
// @ts-ignore
import { MyServer } from "../server/start-server";
import { AntennaResolver } from "./resolvers/antenna";
import { FlightsResolver } from "./resolvers/flight";
import { MetaResolver } from "./resolvers/meta";
import { UserResolver } from "./resolvers/user";
import { VersionResolver } from "./resolvers/version";

export async function setApiGateway(server: MyServer): Promise<void> {
  const resolvers = [
    MetaResolver,
    AntennaResolver,
    FlightsResolver,
    UserResolver,
    VersionResolver
  ];
  server.resolvers = resolvers;

  const sdlPath = path.resolve(__dirname, "api-gateway.graphql");
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: {
      path: sdlPath,
      commentDescriptions: true
    },
    validate: false
  });

  const apollo = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context: async ({ ctx }) => {
      return {
        gateways: server.gateways,
        model: server.model,
        headers: ctx.req.headers
      };
    }
  });
  const gpath = "/api-gateway/";
  apollo.applyMiddleware({ app: server.app, path: gpath });
}
