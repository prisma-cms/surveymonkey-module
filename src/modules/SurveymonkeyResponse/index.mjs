
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class SurveymonkeyResponseProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "SurveymonkeyResponse";
  }

}


export default class SurveymonkeyResponseModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return SurveymonkeyResponseProcessor;
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
        surveymonkeyResponse: (source, args, ctx, info) => {
          return ctx.db.query.surveymonkeyResponse(args, info);
        },
        surveymonkeyResponses: (source, args, ctx, info) => {
          return ctx.db.query.surveymonkeyResponses(args, info);
        },
        surveymonkeyResponsesConnection: (source, args, ctx, info) => {
          return ctx.db.query.surveymonkeyResponsesConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        // createSurveymonkeyResponseProcessor: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).createWithResponse("SurveymonkeyResponse", args, info);
        // },
        updateSurveymonkeyResponseProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("SurveymonkeyResponse", args, info);
        },
        // deleteSurveymonkeyResponse: (source, args, ctx, info) => {
        //   return this.getProcessor(ctx).delete("SurveymonkeyResponse", args, info);
        // },
      },
      Subscription: {
        ...Subscription,
        // surveymonkeyResponse: {
        //   subscribe: async (parent, args, ctx, info) => {

        //     return ctx.db.subscription.surveymonkeyResponse({}, info);
        //   },
        // },
      },
      SurveymonkeyResponseResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.surveymonkeyResponse({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}
