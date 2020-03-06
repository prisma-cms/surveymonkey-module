
import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";


export class SurveymonkeySurveyProcessor extends PrismaProcessor {

  constructor(props) {

    super(props);

    this.objectType = "SurveymonkeySurvey";
  }


  async create(method, args, info) {

    if (args.data) {

      const {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.create(method, args, info);
  }


  async update(method, args, info) {

    if (args.data) {

      const {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.update(method, args, info);
  }


  async mutate(method, args, info) {

    if (args.data) {

      const {
        ...data
      } = args.data;

      args.data = data;

    }

    return super.mutate(method, args);
  }



  async delete(method, args, info) {

    return super.delete(method, args);
  }
}


export default class SurveymonkeySurveyModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return SurveymonkeySurveyProcessor;
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
        surveymonkeySurvey: (source, args, ctx, info) => {
          return ctx.db.query.surveymonkeySurvey(args, info);
        },
        surveymonkeySurveys: (source, args, ctx, info) => {
          return ctx.db.query.surveymonkeySurveys(args, info);
        },
        surveymonkeySurveysConnection: (source, args, ctx, info) => {
          return ctx.db.query.surveymonkeySurveysConnection(args, info);
        },
      },
      Mutation: {
        ...Mutation,
        createSurveymonkeySurveyProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).createWithResponse("SurveymonkeySurvey", args, info);
        },
        updateSurveymonkeySurveyProcessor: (source, args, ctx, info) => {
          return this.getProcessor(ctx).updateWithResponse("SurveymonkeySurvey", args, info);
        },
        deleteSurveymonkeySurvey: (source, args, ctx, info) => {
          return this.getProcessor(ctx).delete("SurveymonkeySurvey", args, info);
        },
      },
      Subscription: {
        ...Subscription,
        surveymonkeySurvey: {
          subscribe: async (parent, args, ctx, info) => {

            return ctx.db.subscription.surveymonkeySurvey({}, info);
          },
        },
      },
      SurveymonkeySurveyResponse: {
        data: (source, args, ctx, info) => {

          const {
            id,
          } = source.data || {};

          return id ? ctx.db.query.surveymonkeySurvey({
            where: {
              id,
            },
          }, info) : null;
        },
      },
    }

  }

}
