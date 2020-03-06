
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class SurveymonkeyCollectorProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "SurveymonkeyCollector";
  }

}


export default class SurveymonkeyCollectorModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return SurveymonkeyCollectorProcessor;
  }


  getResolvers() {

    const {
      Query: {
        ...Query
      },
      Subscription: {
        ...Subscription
      },
      Mutation: {
        ...Mutation
      },
      ...other
    } = super.getResolvers();

    return {
      ...other,
      Query: {
        ...Query,
        surveymonkeyCollector: (source, args, ctx, info) => {
          return ctx.db.query.surveymonkeyCollector(args, info);
        },
        surveymonkeyCollectors: (source, args, ctx, info) => {
          return ctx.db.query.surveymonkeyCollectors(args, info);
        },
        surveymonkeyCollectorsConnection: (source, args, ctx, info) => {
          return ctx.db.query.surveymonkeyCollectorsConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createSurveymonkeyCollectorProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("SurveymonkeyCollector", args, info);
        },
        updateSurveymonkeyCollectorProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("SurveymonkeyCollector", args, info);
        },
        deleteSurveymonkeyCollector: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("SurveymonkeyCollector", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        surveymonkeyCollector: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.surveymonkeyCollector({}, info);
          },
        },
      },
      SurveymonkeyCollectorResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.surveymonkeyCollector({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}
