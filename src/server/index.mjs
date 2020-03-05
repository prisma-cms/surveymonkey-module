

import {
  modifyArgs,
  PrismaCmsServer,
} from '@prisma-cms/server'

import { CoreModuleCustom } from './scripts/deploy/schema.mjs'

const coreModule = new CoreModuleCustom({
})

const resolvers = coreModule.getResolvers()


class PrismaCmsServerCustom extends PrismaCmsServer {

  // getServer() {
  //   const server = super.getServer();
  //   return server;
  // }


  // processRequest(request) {

  //   return super.processRequest({
  //     ...request,
  //   });
  // }

}


const startServer = function (options) {
  return new PrismaCmsServerCustom(options).startServer()
}


startServer({
  typeDefs: 'src/schema/generated/api.graphql',
  resolvers,
  contextOptions: {
    modifyArgs,
    resolvers,
  },
})


