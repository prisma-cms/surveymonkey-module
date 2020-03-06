
import dotenv from 'dotenv';

import {
  modifyArgs,
  PrismaCmsServer,
} from '@prisma-cms/server'

import bodyParser from 'body-parser';

import { CoreModuleCustom } from './scripts/deploy/schema.mjs'


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


    app.express.use('/surveys', bodyParser.json({
      type: 'application/vnd.surveymonkey.response.v1+json',
    }));

    app.use('/surveys', (req, res, next) => {

      console.log('surveys headers', req.headers);
      console.log('surveys body', req.body);

      // next();

      res.status(200).end('sdfdsf');
    });

    // app.use('/surveys/**', (req, res, next) => {

    //   console.log('surveys 2 headers', req.headers);
    //   console.log('surveys 2 body', req.body);

    //   // next();

    //   res.status(200).end('sdfdsf');
    // });

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


