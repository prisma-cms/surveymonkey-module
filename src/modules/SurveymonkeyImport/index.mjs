
import Debug from "debug";

import PrismaModule from "@prisma-cms/prisma-module";
import PrismaProcessor from "@prisma-cms/prisma-processor";
import { request } from "../../";

const debug = Debug('surveymonkey_module:import');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class SurveymonkeyImportProcessor extends PrismaProcessor {

  async surveymonkeyImportSurveys(method, args, info) {

    // const {
    //   ctx: {
    //     db,
    //   },
    // } = this;

    /**
     * Получаем все опросники
     */

    const surveysResponse = await request('/surveys');

    debug('surveysResponse', surveysResponse);

    const {
      data: surveys,
    } = surveysResponse;


    debug('surveys', surveys);

    this.created = 0;
    this.updated = 0;

    /**
     * Проходимся по каждому опроснику
     */

    const iterator = this.surveysProcessor(surveys);

    for await (const survey of iterator) {
      debug('survey', survey);
    }


    /**
     * Импортируем веб-хуки
     */
    await this.importWebHooks();

    const result = {
      created: this.created,
      updated: this.updated,
    };

    return result;
  }

  async * surveysProcessor(items) {

    // console.log('itemsProcessor items', items);

    const {
      ctx: {
        db,
      },
    } = this;

    let item;

    // eslint-disable-next-line no-cond-assign
    while (item = items.shift()) {

      const {
        id: externalKey,
        title: name,
        nickname,
        href,
      } = item;

      const where = {
        externalKey,
      };

      let survey = await db.query.surveymonkeySurvey({
        where,
      });


      debug('surveysProcessor survey', survey);


      const data = {
        externalKey,
        name,
        nickname,
        href,
        // Collectors,
      };

      /**
       * Если не был получен опросник, создаем новый
       */
      if (!survey) {

        survey = await db.mutation.createSurveymonkeySurvey({
          data,
        })
          .then(r => {
            this.created++;
            return r;
          });

      }
      else {

        survey = await db.mutation.updateSurveymonkeySurvey({
          where,
          data,
        })
          .then(r => {
            this.updated++;
            return r;
          });
      }


      /**
       * Получаем коллекторы
       */

      const collectorsResponse = await request(`/surveys/${externalKey}/collectors`);

      debug('collectorsResponse', JSON.stringify(collectorsResponse, true, 2));

      const {
        data: collectorsData,
      } = collectorsResponse;


      if (collectorsData && collectorsData.length) {

        for await (const collector of this.collectorsProcess(collectorsData, survey || where)) {
          debug('collectorsData collector', collector);
        }

      }


      yield survey;
    }

  }

  async * collectorsProcess(items, survey) {

    debug('collectorsProcess survey', survey);

    const {
      ctx: {
        db,
      },
    } = this;

    const {
      externalKey: surveyExternalKey,
    } = survey;

    let item;

    while (item = items.shift()) {

      const {
        id: externalKey,
      } = item;

      const where = {
        externalKey,
      };

      if (!externalKey) {
        throw new Error('externalKey is empty');
      }

      let collector = await db.query.surveymonkeyCollector({
        where,
      });

      debug('collectorsProcess collector', collector);

      const collectorResponse = await request(`/collectors/${externalKey}`);

      debug('collectorResponse', collectorResponse);

      const {
        type,
        name,
        hash,
        status,
        url,
        href,
      } = collectorResponse;

      const data = {
        externalKey,
        type: type ? capitalizeFirstLetter(type) : null,
        status: status ? capitalizeFirstLetter(status) : null,
        name,
        hash,
        url,
        href,
      };

      if (collector) {

        collector = await db.mutation.updateSurveymonkeyCollector({
          where,
          data,
        });

      }
      else {

        Object.assign(data, {
          Survey: {
            connect: {
              externalKey: surveyExternalKey,
            },
          },
        });

        collector = await db.mutation.createSurveymonkeyCollector({
          data,
        });

      }

      yield collector;

    }
  }


  async importWebHooks() {

    const webhooksResponse = await request('/webhooks');

    debug('webhooksResponse', webhooksResponse);

    const {
      data: webhooksData,
    } = webhooksResponse;


    const iterator = this.webhooksProcessor(webhooksData);

    for await (const item of iterator) {
      debug('Webhook item', item);
    }

  }

  async * webhooksProcessor(items) {

    const {
      ctx: {
        db,
      },
    } = this;

    let item;

    while (item = items.shift()) {

      debug('webhooksProcessor item', item);

      const {
        id: externalKey,
      } = item;

      if (!externalKey) {
        throw new Error('externalKey is empty');
      }

      const where = {
        externalKey,
      };

      let webhook = await db.query.surveymonkeySurveyWebhook({
        where,
      });

      debug('webhooksProcessor webhook', webhook);

      const webhookResponse = await request(`/webhooks/${externalKey}`);

      debug('webhookResponse', webhookResponse);

      const {
        name,
        event_type,
        subscription_url,
        object_type,
        href,
        object_ids,
      } = webhookResponse;

      const Surveys = {
        connect: object_ids ? object_ids.map(id => ({
          externalKey: id,
        })) : [],
      }


      const data = {
        externalKey,
        name,
        event_type,
        subscription_url,
        object_type,
        href,
        Surveys,
      };

      // console.log('data', JSON.stringify(data, true, 2));

      if (webhook) {

        webhook = await db.mutation.updateSurveymonkeySurveyWebhook({
          where,
          data,
        });

      }
      else {

        webhook = await db.mutation.createSurveymonkeySurveyWebhook({
          data,
        });

      }

      yield webhook;

    }

  }
}


export default class SurveymonkeyImportModule extends PrismaModule {

  constructor(props = {}) {

    super(props);

    this.mergeModules([
    ]);

  }


  getProcessor(ctx) {
    return new (this.getProcessorClass())(ctx);
  }


  getProcessorClass() {
    return SurveymonkeyImportProcessor;
  }


  getResolvers() {

    return {
      Mutation: {
        surveymonkeyImportSurveys: (source, args, ctx, info) => {
          return this.getProcessor(ctx).surveymonkeyImportSurveys(args, info);
        },
      },
    }

  }

}
