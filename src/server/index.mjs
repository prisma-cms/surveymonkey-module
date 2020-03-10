
import dotenv from 'dotenv';

import {
  modifyArgs,
  PrismaCmsServer,
} from '@prisma-cms/server'

import { CoreModuleCustom } from './scripts/deploy/schema.mjs'
import { CreateRouter } from '../';


dotenv.config();

const coreModule = new CoreModuleCustom({
})

const resolvers = coreModule.getResolvers()

// console.log('resolvers', resolvers);


class PrismaCmsServerCustom extends PrismaCmsServer {

  getServer() {
    const server = super.getServer();

    // console.log('surveys server', server);

    const app = server.server;

    app.express.use('/surveys', CreateRouter({
      server,
      // webhookResponseCompleted: '/',
    }));

    return server;
  }


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


